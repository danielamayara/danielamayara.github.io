# Zuzu — Chatbot interativo

Projeto Next.js (App Router), React, TypeScript e Mantine. Possui interface de chat com visual rosa delicado e API interna baseada em regras (`/api/chat`). Não precisa de chave de API nem serviço de inteligência artificial.

## Como abrir no VS Code (Windows)



1. Abra [http://localhost:3000](http://localhost:3000) no navegador.

> O `npm.cmd` evita o bloqueio de `npm.ps1` que pode acontecer no PowerShell do Windows.

## Estrutura

- `app/page.tsx`: interface do chatbot (React + Mantine).
- `app/page.module.css`: estilos em rosa.
- `app/layout.tsx`: `MantineProvider` e CSS do Mantine.
- `app/api/chat/route.ts`: recebe `POST` com `{ "message": "Oi" }` e responde `{ "reply": "..." }`.

## Como personalizar respostas

Edite a função `gerarResposta` em `app/api/chat/route.ts`. Ela usa palavras-chave para identificar o assunto e devolver mensagens pré-programadas. Não é uma IA generativa.

## Para adicionar ao GitHub

