# SONAR — plataforma educativa sobre percepção sonora canina

Aplicação React + Vite com páginas editoriais, quiz, laboratório de frequências e SONAR IA (API OpenRouter no servidor).

## Requisitos
- Node.js 22 LTS (ou versão compatível com Vite 7)
- npm 10+

## Executar no Windows
Abra o terminal na pasta extraída, onde está este `package.json`, e execute:

```powershell
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`). O modo de desenvolvimento inicia a interface e a API no mesmo servidor.

## Compilar e executar a versão de publicação
```powershell
npm run build
npm start
```

A versão compilada é servida pelo servidor Node. Configure `PORT` no ambiente de hospedagem se o provedor exigir uma porta específica. O site usa a raiz `/` por padrão; não configure um subcaminho sem ajustar também o roteamento da hospedagem.

## SONAR IA / OpenRouter
Copie `.env.example` para `.env` e configure `OPENROUTER_API_KEY` no ambiente local. O arquivo `.env` é ignorado pelo Git e nunca deve ser publicado. Em hospedagens, cadastre a chave no painel de variáveis/segredos do serviço e reinicie a aplicação. O modelo pode ser definido por `OPENROUTER_MODEL`; o padrão é `openai/gpt-4.1-mini`. Sem a chave, o chat informa que a IA não está configurada e as demais páginas continuam funcionando.

A chave é lida apenas pelo servidor. Não use variáveis `VITE_*` para segredos.

## Laboratório e bem-estar
O laboratório gera um tom somente após o usuário pressionar o botão, com faixa de 80–2.000 Hz, duração máxima de 5 segundos e controle de saída limitado. O nível real também depende do dispositivo e dos fones. Não use a ferramenta para testar ou provocar reações de animais; prefira a visualização quando houver um cão por perto.

## Conteúdo e mídia
O projeto não inclui vídeos de experimento. O conteúdo educativo distingue exemplos ilustrativos de fatos e mantém as referências existentes.

## Verificação rápida

Depois de instalar as dependências, `npm run verify` verifica a presença das rotas e arquivos essenciais, os padrões de configuração e a proteção básica da chave da OpenRouter. `npm run typecheck` executa a checagem TypeScript; `npm run build` compila a aplicação para publicação.


## Publicar na Vercel (frontend + API)
1. Envie a pasta raiz do projeto para um repositório GitHub. A raiz do repositório deve conter `package.json`, `vercel.json` e a pasta `api/`.
2. Na Vercel, escolha **Add New → Project** e importe o repositório. A Vercel deve detetar Vite; o comando de build é `npm run build` e o diretório de saída é `dist`.
3. Em **Settings → Environment Variables**, adicione `OPENROUTER_API_KEY` com a sua chave privada e, opcionalmente, `OPENROUTER_MODEL` com `openai/gpt-4.1-mini`. Ative pelo menos **Production** (e Preview se desejar). Nunca use o prefixo `VITE_` para a chave.
4. Faça Deploy e teste a página inicial e a secção IA. Quando mudar variáveis de ambiente, crie um novo deploy.

A Vercel usa `api/sonar/insight.js` como função de servidor. `local-server.mjs` é apenas para executar a versão compilada localmente e não é a entrada de backend da Vercel.
