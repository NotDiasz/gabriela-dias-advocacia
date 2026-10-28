// Todos os campos da apresentação que aguardam confirmação estão aqui.
export const site = {
  name: "Gabriela Dias",
  title: "Gabriela Dias — Advocacia",
  description:
    "Escuta atenta e clareza em cada passo. Conheça a atuação e a forma de trabalhar de Gabriela Dias.",
  oab: "[OAB/UF nº a informar]",
  city: "[Cidade / UF]",
  address: "[Endereço a informar]",
  whatsapp: "[WhatsApp a informar]",
  whatsappUrl: "",
  email: "[E-mail a informar]",
  emailUrl: "",
  education: "[Formação e instituição a informar]",
  biography: "[Trajetória profissional a informar]",
  areasLabel: "[Família · Civil · Consumidor · Trabalhista]",
  areasNote: "[Áreas de atuação provisórias, a confirmar]",
  year: new Date().getFullYear(),
};

export const steps = [
  {
    title: "Primeira conversa",
    text: "Um espaço para ouvir sua história e entender o que você precisa.",
  },
  {
    title: "Análise cuidadosa",
    text: "Documentos e informações são reunidos para compreender o contexto.",
  },
  {
    title: "Caminho definido",
    text: "As possibilidades são explicadas com clareza, para uma decisão consciente.",
  },
  {
    title: "Acompanhamento",
    text: "Você recebe orientação e informações sobre cada próximo passo.",
  },
];

export const numbers = [
  { value: "04", label: "áreas de atuação", confirmar: false },
  {
    value: "27",
    label: "estados alcançados pelo atendimento on-line",
    confirmar: true,
  },
  {
    value: "100%",
    label: "dos casos conduzidos pela própria advogada",
    confirmar: false,
  },
  { value: "24h", label: "para responder o primeiro contato", confirmar: true },
];

export const commitments = [
  {
    title: "Você fala comigo.",
    text: "Do primeiro contato à última decisão, quem conduz o seu caso é a advogada responsável.",
  },
  {
    title: "Sem juridiquês.",
    text: "Cada etapa explicada em linguagem simples e, quando você precisar, por escrito.",
  },
  {
    title: "Expectativas honestas.",
    text: "Você conhece os riscos e as possibilidades reais, sem promessa de resultado.",
  },
  {
    title: "Sigilo absoluto.",
    text: "O que você conta fica protegido, como manda a ética da advocacia.",
  },
  {
    title: "Retorno combinado.",
    text: "Prazos de resposta definidos já na primeira conversa.",
  },
];

export const questions = [
  {
    question: "Como funciona o primeiro contato?",
    answer:
      "A primeira conversa permite conhecer sua situação e identificar quais informações serão necessárias para uma análise. O formato e a disponibilidade são combinados diretamente com a advogada.",
  },
  {
    question: "O atendimento pode ser feito on-line?",
    answer:
      "A possibilidade de atendimento on-line e presencial será informada no contato inicial, conforme a sua necessidade e a disponibilidade de agenda.",
  },
  {
    question: "Quais documentos preciso separar?",
    answer:
      "Isso depende do assunto. No primeiro contato, explique brevemente a situação. Depois, você recebe a orientação sobre os documentos relevantes para a análise.",
  },
  {
    question: "Como acompanho o meu caso?",
    answer:
      "Os canais e a frequência de atualização são combinados no início do atendimento. As informações são apresentadas em linguagem simples, respeitando a confidencialidade.",
  },
  {
    question: "É possível saber o resultado antes de começar?",
    answer:
      "Cada situação exige análise individual. A atuação jurídica envolve circunstâncias e decisões que não permitem garantir resultados. Você será orientado sobre as possibilidades e os riscos identificados.",
  },
];

// Depoimentos de EXEMPLO para a apresentação: troque pelos relatos reais (com
// autorização de cada cliente) e mude `exemplo` para false. Atenção à ética da
// OAB (Provimento 205/2021) antes de publicar.
export const testimonials = [
  {
    text: "Eu chegava às reuniões com medo de não entender nada e saía sabendo exatamente o próximo passo. Fui ouvida de verdade.",
    name: "M. A.",
    context: "Família e Sucessões",
    exemplo: true,
  },
  {
    text: "Cada documento veio com uma explicação simples. Nunca precisei correr atrás de notícia do meu processo.",
    name: "R. S.",
    context: "Direito do Consumidor",
    exemplo: true,
  },
  {
    text: "Atenciosa do começo ao fim. Respondeu todas as minhas dúvidas com paciência e franqueza, sem prometer o que não podia.",
    name: "C. L.",
    context: "Direito Civil e Contratos",
    exemplo: true,
  },
  {
    text: "Me senti respeitada em um momento difícil. Tudo foi conduzido com discrição e cuidado.",
    name: "A. P.",
    context: "Direito Trabalhista",
    exemplo: true,
  },
];
