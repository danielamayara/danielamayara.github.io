import { NextResponse } from "next/server";

// Padroniza o texto para reconhecer palavras com ou sem acentos.
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function gerarResposta(mensagem: string): string {
  const texto = normalizar(mensagem);

  
  if (/\b(quem e voce|quem te criou|quem criou voce|qual (e )?o seu nome|como voce se chama|seu nome|nome do chatbot)\b/.test(texto)) {
    return "Eu sou o Zuzu, um chatbot criado pela Daniela! Estou aprendendo a conversar e posso ajudar com alguns assuntos de tecnologia.";
  }

  if (/\b(o que voce faz|o que voce pode fazer|o que voce sabe fazer|como voce pode ajudar|suas funcionalidades|o que pode fazer)\b/.test(texto)) {
    return "Posso conversar com você, explicar conceitos básicos de programação. Experimente perguntar sobre HTML, CSS, JavaScript, React ou Next.js!";
  }

  // Explicações rápidas sobre tecnologia.
  if (/\b(next\.?js|nextjs)\b/.test(texto)) {
    return "Next.js é um framework baseado em React. Ele oferece recursos como rotas por arquivos, renderização no servidor e rotas de API, como esta que estamos usando para conversar.";
  }

  if (/\b(react)\b/.test(texto)) {
    return "React é uma biblioteca JavaScript para construir interfaces. Com ele, você cria componentes reutilizáveis e atualiza a tela quando os dados mudam, por exemplo, com o useState.";
  }

  if (/\b(typescript)\b/.test(texto)) {
    return "TypeScript é uma extensão do JavaScript que permite definir tipos. Isso ajuda a detectar erros durante o desenvolvimento e deixa o código mais fácil de manter.";
  }

  if (/\b(javascript|js)\b/.test(texto)) {
    return "JavaScript é a linguagem que adiciona comportamento às páginas, como cliques, validações e atualizações de conteúdo. Também pode ser usada no backend com Node.js.";
  }

  if (/\b(html)\b/.test(texto)) {
    return "HTML organiza a estrutura de uma página: títulos, parágrafos, links, imagens e formulários. O CSS cuida da aparência e o JavaScript, das interações.";
  }

  if (/\b(css)\b/.test(texto)) {
    return "CSS define o visual de uma página: cores, fontes, espaçamentos, layouts e animações. Para começar, vale praticar Flexbox, Grid e responsividade.";
  }

  if (/\b(api|backend|rota de api)\b/.test(texto)) {
    return "Uma API permite que partes de um sistema troquem informações. Aqui, sua página envia uma mensagem para /api/chat, e a rota devolve um JSON com a propriedade reply.";
  }



  // Respostas de conversa.
  if (/\b(tudo bem|como voce esta|como vai)\b/.test(texto)) {
    return "Tudo certo por aqui!;
  }

  if (/\b(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)\b/.test(texto)) {
    return "Oi! Eu sou o Zuzu. Como posso ajudar você hoje?";
  }

  if (/\b(obrigad[oa]|valeu|agradeco)\b/.test(texto)) {
    return "Por nada! Se precisar de mais alguma coisa, é só chamar.";
  }

  if (/\b(tchau|ate logo|ate mais|falou)\b/.test(texto)) {
    return "Até mais! Foi bom conversar com você.";
  }

  if (/\b(piada|engracado)\b/.test(texto)) {
    return "Por que o programador prefere o modo escuro? Porque a luz atrai bugs!";
  }

  return "Ainda não sei responder isso. Você pode perguntar meu nome, o que eu faço ou sobre HTML, CSS, JavaScript, React, Next.js e APIs. Também posso ajudar a organizar uma ideia ou um plano de estudos.";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Envie um JSON válido." },
      { status: 400 }
    );
  }

  const message =
    typeof body === "object" && body !== null && "message" in body
      ? body.message
      : undefined;

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "A mensagem precisa ser um texto não vazio." },
      { status: 400 }
    );
  }

  if (message.length > 500) {
    return NextResponse.json(
      { error: "A mensagem deve ter no máximo 500 caracteres." },
      { status: 400 }
    );
  }

  return NextResponse.json({ reply: gerarResposta(message) });
}
