import express from 'express';
import { createServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.post('/api/sonar/insight', async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12 || messages.some(m => !m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 2000) || messages.at(-1)?.role !== 'user') {
    return res.status(400).json({ error: 'Envie uma pergunta válida para o assistente.' });
  }
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return res.status(503).json({ error: 'A IA ainda não está configurada. Cadastre OPENROUTER_API_KEY nas variáveis de ambiente do servidor.' });
  const abort = new AbortController();
  res.on('close', () => { if (!res.writableEnded) abort.abort(); });
  try {
    const client = new OpenAI({ apiKey, baseURL: 'https://openrouter.ai/api/v1', defaultHeaders: { 'X-Title': 'SONAR' } });
    const stream = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL?.trim() || 'openai/gpt-4.1-mini',
      max_tokens: 1200, stream: true,
      messages: [{ role: 'system', content: 'Você é o SONAR Insight, um assistente educativo sobre audição canina, percepção de sons e comportamento. Responda em português brasileiro, com clareza e cautela. Diferencie conhecimento geral de hipóteses e observações individuais; cães podem reagir de maneiras diferentes e um comportamento isolado não prova uma emoção ou causa. Não invente estudos, citações, resultados experimentais ou vídeos. Não diagnostique nem prescreva tratamento. Recomende um médico-veterinário quando houver preocupação com saúde ou sofrimento. Se algo não estiver bem estabelecido, diga isso.' }, ...messages] }, { signal: abort.signal });
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (typeof content === 'string' && content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    if (!res.destroyed) { res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); }
  } catch (error) {
    if (abort.signal.aborted) return;
    console.error('SONAR Insight provider request failed:', error instanceof Error ? error.message : 'unknown error');
    if (res.headersSent) { if (!res.destroyed) { res.write(`data: ${JSON.stringify({ error: 'A IA não conseguiu concluir a resposta. Verifique a configuração e tente novamente.' })}\n\n`); res.end(); } }
    else res.status(502).json({ error: 'A IA não conseguiu responder. Verifique a chave, o modelo e a conexão com a OpenRouter.' });
  }
});
const vite = await createViteServer({ configFile: path.join(root, 'artifacts/sonar-site/vite.config.ts'), server: { middlewareMode: true, hmr: { server } }, appType: 'spa' });
app.use(vite.middlewares);
const port = Number(process.env.PORT || 5173);
server.listen(port, '0.0.0.0', () => console.log(`SONAR em modo de desenvolvimento: http://localhost:${port}`));
