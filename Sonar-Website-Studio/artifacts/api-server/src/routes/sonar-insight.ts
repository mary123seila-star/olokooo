import OpenAI from "openai";
import { Router, type IRouter, type Response } from "express";
import { AskSonarInsightBody } from "@workspace/api-zod";

const router: IRouter = Router();
const model = process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4.1-mini";

const systemPrompt = `Você é o SONAR Insight, um assistente educativo sobre audição canina, percepção de sons e comportamento. Responda em português brasileiro, com clareza, empatia e cautela. Diferencie conhecimento geral de hipóteses e observações individuais; explique que cães podem reagir de maneiras diferentes e que um comportamento isolado não prova uma emoção ou causa. Não invente estudos, citações, resultados experimentais ou vídeos. Não diagnostique nem prescreva tratamento. Recomende procurar um médico-veterinário ou profissional qualificado quando a pergunta envolver saúde ou sofrimento. Se algo não estiver bem estabelecido, diga isso explicitamente.`;

function writeEvent(
  response: Response,
  data: Record<string, unknown>,
): void {
  if (!response.destroyed) {
    response.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

router.post("/sonar/insight", async (req, res): Promise<void> => {
  const parsed = AskSonarInsightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Envie uma pergunta válida para o assistente." });
    return;
  }

  const messages = parsed.data.messages;
  if (messages[messages.length - 1]?.role !== "user") {
    res.status(400).json({ error: "A conversa precisa terminar com uma pergunta." });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    res.status(503).json({
      error: "Assistente indisponível: a credencial de IA não está configurada no servidor.",
    });
    return;
  }

  const abortController = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) abortController.abort();
  });

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: { "X-Title": "SONAR" },
    });
    const stream = await client.chat.completions.create(
      {
        model,
        max_tokens: 8192,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      },
      { signal: abortController.signal },
    );

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (typeof content === "string" && content.length > 0) {
        writeEvent(res, { content });
      }
    }

    writeEvent(res, { done: true });
    res.end();
  } catch (error) {
    if (abortController.signal.aborted) return;

    const status = error instanceof OpenAI.APIError ? error.status : undefined;
    req.log.error({ status }, "SONAR Insight provider request failed");
    if (res.headersSent) {
      writeEvent(res, {
        error: "A IA não conseguiu concluir a resposta. Tente novamente em instantes.",
      });
      res.end();
      return;
    }

    res.status(502).json({
      error: "A IA não conseguiu responder agora. Tente novamente em instantes.",
    });
  }
});

export default router;
