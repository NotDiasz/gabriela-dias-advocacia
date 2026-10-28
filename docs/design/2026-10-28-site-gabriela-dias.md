# Site Gabriela Dias Advocacia — especificação (versão de apresentação)

_Escrito em 2026-10-28 pelo Claude (coordenador). Fonte de verdade para quem constrói._

## Intenção

Site de **marca pessoal** da advogada **Gabriela Dias**, na mesma linha do site do João
Oliveira (`C:\Users\Miguel\orca\projects\web-front-astrax`, consulte o código e
`docs/design/2026-10-26-site-joao-oliveira.md` de lá como referência de comportamento e de
qualidade), mas com **cara própria**: feminina sem ser "rosa", clara, luxo discreto, "Old Money".

Primeira versão para **apresentar à cliente**. Áreas, cidade, OAB, contatos: **placeholders**
num único arquivo `src/data/site.ts`, visíveis entre colchetes.

Áreas provisórias (mesmo peso): Família e Sucessões (`familia`), Direito Civil e Contratos
(`civil`), Direito do Consumidor (`consumidor`), Direito Trabalhista (`trabalhista`).

## Identidade

### Paleta (decidida pelo Miguel: Champagne + Bordô, base clara)

| Token              | HEX       | Uso                                                   |
| ------------------ | --------- | ----------------------------------------------------- |
| `--color-marfim`   | `#F4EEE6` | **fundo padrão do site** (papel)                       |
| `--color-cafe`     | `#241A17` | tinta: texto, seções escuras de contraste              |
| `--color-bordo`    | `#7A1F2B` | destaque: **o ponto do "i"**, links, seção de contato  |
| `--color-champagne`| `#C9A97A` | metal: filetes, monograma em relevo, etiquetas         |
| `--color-nude`     | `#E7D3C7` | apoio: blocos suaves, cartões                          |

Seções escuras (café) entram como contraste: manifestos e carrossel de áreas.

### Tipografia (old money de luxo)

- **Cormorant Garamond** (300/400/500 + itálico): títulos enormes, manifestos.
- **Cinzel** (400/500): caixa alta espaçada — a etiqueta curvada do hero, monograma de apoio,
  etiquetas `(01) — ÁREAS`.
- **Assinatura**: fonte script caligráfica para "Gabriela Dias" (intro e lockup). Candidatas:
  **Monsieur La Doulaise**, **Mrs Saint Delafield**, **Allura**, **Great Vibes** (não usar
  Pinyon Script, que é do João). A escolhida sai das explorações de marca.
- **Jost** (400/500): texto corrido (mín. 17 px desktop, 16 px celular).
- Self-host via `@fontsource`.

### Marca

Monograma **GD**, assinatura "Gabriela Dias" com o **ponto do i em bordô** (assinatura
característica da marca: aparece na intro, no lockup e no favicon como um ponto bordô), lockup
assinatura + "ADVOCACIA" em Cinzel espaçado. Kit vetorial em `brand/` com manual
`brand/brand-kit.html` e `brand/tokens.css`, no padrão do kit do João.

## Anti-objetivos (rejeitados pelo Miguel)

- Nada de "cara de IA": sem listras, quadriculado, grid decorativo, neon, glow,
  glassmorphism, gradiente como enfeite, partículas, blobs.
- Nada de balança da justiça, martelo, pilares. Nada de rosa-bebê, nada de clichê "girl boss".
- Movimento lento e com peso (0,8–1,4 s, `power3.out`/`expo.out`), nunca `back`/`elastic`.
- Ética da OAB (Provimento 205/2021): sem promessa de resultado, preço, depoimentos ou números de casos, clientes e resultados. Números de atendimento e compromissos da própria advogada seguem a decisão de 2026-10-28; dados pendentes ficam marcados em `src/data/site.ts`.

## Stack

Igual ao João: **Astro 5 + React** (ilhas), TypeScript, npm, **GSAP 3** (ScrollTrigger,
SplitText, DrawSVG/MorphSVG são gratuitos desde a 3.13) + **Lenis**; CSS próprio a partir de
`brand/tokens.css`, sem Tailwind; `astro:assets`; View Transitions com cortina marfim.
**three.js + @react-three/fiber + @react-three/drei** só para o objeto 3D real (seção 4).

## Home — seções em ordem

0. **Intro (antes de tudo)**: fundo marfim. "Gabriela Dias" é **escrita à mão** na tela no
   desenho da fonte script: os contornos dos glifos convertidos em `path` SVG (opentype.js em
   build ou script, nunca em runtime), traço café que se desenha letra a letra
   (`stroke-dashoffset`/DrawSVG, ordem da escrita, ~2,2 s), depois o preenchimento entra por
   máscara. Por último, **o ponto do "i" cai em bordô** (pequeno assentamento, sem quique).
   "ADVOCACIA" em Cinzel aparece embaixo com tracking abrindo. A tela sobe como cortina.
   Máx. ~3,2 s, botão "pular" acessível, só na primeira visita da sessão (`sessionStorage`),
   reduzido a um fade com `prefers-reduced-motion`.
1. **Hero (interativo)**: a Gabriela **no centro** (recorte `public/media/gabriela-recorte.webp`,
   do peito para cima), sobre o marfim com uma luz quente suave atrás (radial nude, baixa
   opacidade). **Acima da cabeça, uma etiqueta em arco**: `GA · BRI · E · LA` — Cinzel caixa
   alta, peso forte, sílabas bem separadas por pontos médios, curvada (SVG `textPath` num arco
   que acompanha a cabeça). Atrás dela, **"Dias"** gigante em Cormorant itálico, cor nude/
   champagne, parcialmente escondido pelo recorte (profundidade). Embaixo: linha de áreas em
   etiqueta espaçada e botão "Agendar conversa". Interação: mouse move em parallax por camadas
   (arco, nome de fundo, retrato, em profundidades diferentes) e o arco gira levemente seguindo
   o cursor; no celular, giroscópio opcional ou sem efeito. Scroll: as sílabas do arco se
   afastam e sobem, o retrato desce mais devagar, "Dias" cresce. Entrada logo após a intro.
2. **Manifesto 1** (fundo café, pin + scrub, linhas acendendo de 18% a 100%):
   `ESCUTA ATENTA.` · "Antes de qualquer estratégia, entender a sua história: o que aconteceu,
   o que preocupa, o que você precisa." · `[ O MÉTODO ]` · objeto: `tinteiro`.
3. **Manifesto 2**: `CLAREZA EM CADA PASSO.` · "Você sabe o que está acontecendo no seu caso,
   em linguagem simples, do primeiro contato à última decisão." · `[ O COMPROMISSO ]` ·
   objeto: `chave`.
4. **A marca** (fundo marfim, pin ~350vh): **objeto 3D real** — o **anel-sinete em ouro
   champagne com o monograma GD gravado**, em three.js (geometria + material metálico com
   ambiente quente, sem bloom). Ele gira com o scroll e responde ao arrasto/cursor (inclina,
   rotação com inércia). Atrás, `GABRIELA DIAS — ADVOCACIA —` gigante só em contorno correndo
   na horizontal. Faixas de cor (marfim → nude → bordô → café) varrem a tela; etiqueta embaixo
   à esquerda com nome e HEX da cor; linha de progresso no topo. No fim, zoom para dentro do
   anel até o café tomar a tela e virar a seção de áreas. Fallback sem WebGL / reduzido:
   imagem `public/media/objetos/anel.webp`.
5. **Áreas** (`(03) — ATUAÇÃO`, fundo café): carrossel 3D de 4 cartões em perspectiva
   avançando com o scroll, contador `01 / 04`; cartões alternam bordô e café com filete duplo
   champagne; numeral romano em Cormorant itálico. Celular: scroll-snap horizontal.
6. **Sobre** (`(04) — A ADVOGADA`): retrato revelado por cortina bordô; texto curto com
   campos; a assinatura se desenha de novo (mesmo componente da intro, menor).
7. **Como funciona** (`(05)`): 4 etapas ligadas por linha champagne desenhada com o scroll.
8. **Dúvidas frequentes**: 5 perguntas, acordeão acessível.
9. **Contato** (fundo bordô): "Vamos conversar sobre *o seu caso*." (itálico em script);
   o objeto `envelope` (envelope com lacre bordô GD) entra com efeito de carimbo; WhatsApp e
   e-mail.
10. **Rodapé**: lockup, áreas, OAB nº, ano.

Páginas `/atuacao/<slug>` (4, um template, dados em `src/data/areas.ts`), como no João.

## Contrato de mídia

Quem constrói referencia exatamente estes caminhos; enquanto não existirem, placeholder neutro
(retângulo nude), nunca imagem inventada.

- `public/media/gabriela-retrato.webp` (retrato tratado, 4:5, ≥1600 px de altura)
- `public/media/gabriela-recorte.webp` + `.png` (recorte transparente do peito para cima)
- `public/media/objetos/tinteiro.webp`, `chave.webp`, `envelope.webp`, `anel.webp`
  (transparentes, objeto isolado, ~1600 px no lado maior, luz quente de cima à esquerda)
- `brand/logo/*.svg` (vem do kit, depois da aprovação)

## Coreografia de scroll (pedido do Miguel: bem feita e criativa, diferente em cada área)

**Fio condutor: o ponto bordô.** O ponto do "i" da intro é o personagem do site. Ele reaparece
como guia: vira o ponto final de cada manifesto, percorre a linha do "Como funciona", vira o
lacre do envelope. Quem rola sente que segue o mesmo ponto.

Nenhuma técnica se repete entre seções:

| Seção | Técnica principal (GSAP) | O que acontece |
| --- | --- | --- |
| Intro | timeline + DrawSVG | assinatura escrita; o ponto bordô cai no "i" e fica marcado |
| Hero → saída | scrub sem pin, por camadas | sílabas do arco se afastam cada uma no próprio trajeto ao longo do arco e somem; "Dias" cresce e abre o tracking; o retrato fecha por `clip-path: ellipse()` até virar um **camafeu oval** com filete champagne, que sobe e sai |
| Fundo entre seções | scrub na cor do `body` | marfim → café interpolado no scroll, sem corte seco entre seções claras e escuras |
| Manifesto 1 | pin + SplitText em linhas | linhas acendem de 18% a 100%; o tinteiro inclina com o scroll e **uma gota bordô cai e vira o ponto final** de `ESCUTA ATENTA.` |
| Manifesto 2 | pin + foco | palavras saem de `blur(12px)` e opacidade baixa para nítidas, uma a uma (clareza = foco); a chave gira 90° no fim e a tela **abre como duas folhas de porta** (metades em `clip-path`) revelando a seção da marca |
| A marca | pin longo, timeline com rótulos | anel 3D gira com o scroll, faixas diagonais trocam a cor, texto em contorno corre, zoom para dentro do anel |
| Áreas | pin + rotação de cilindro | os 4 cartões montados num **cilindro 3D** (`rotateY` em volta de um eixo central, `preserve-3d`) que gira um cartão por trecho de scroll; o da frente fica nítido e os de trás escurecem; contador `01 / 04` |
| Sobre | scrub + máscara | cortina bordô revela o retrato; a imagem faz parallax dentro da máscara; a assinatura se desenha **amarrada ao progresso do scroll** (voltar o scroll apaga) |
| Como funciona | MotionPath + DrawSVG | linha champagne em S se desenha e **o ponto bordô viaja por ela**, parando em cada etapa, que acende ao ser tocada |
| Em números | pin + odômetro em máscaras | quatro números de atendimento rolam em colunas de dígitos, um por vez; filete champagne e contador acompanham; o ponto final da última legenda **se espalha como tinta bordô**, em `clip-path: circle()` a partir da sua posição real, dentro do mesmo pin |
| Palavra dada | pin + percurso horizontal | cinco cartas marfim com compromissos da advogada atravessam a tela; entram inclinadas e assentam ao passar pelo centro, com assinatura e ponto bordô; filete champagne acompanha; celular limita os pins a 150vh, e movimento reduzido mantém números finais e cartas em coluna |
| FAQ | reveal simples, stagger curto | pausa de respiro: pouco movimento de propósito |
| Contato | pin curto + timeline | o envelope chega fechado; a aba gira (`rotateX`) e abre, o cartão com o CTA desliza para fora; **o lacre bordô** assenta como carimbo |
| Rodapé | rodapé revelado por baixo | o conteúdo sobe e descobre o rodapé fixo; a assinatura grande se escreve ao chegar no fim |

Regras técnicas:

- Uma função de animação por seção em `src/scripts/motion/<secao>.ts`, chamada por um
  `motion/index.ts` que cria um `gsap.context()` e limpa tudo no `astro:before-swap`. Nada
  de um arquivo único gigante.
- `gsap.matchMedia()` com três contextos: desktop, celular e `prefers-reduced-motion`. No
  celular, pins mais curtos (no máximo ~150vh) e o cilindro vira scroll-snap.
- Lenis sincronizado com o ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)`).
- `ScrollTrigger.refresh()` depois de `document.fonts.ready` e das imagens do hero carregarem;
  seções com pin declaradas em ordem de cima para baixo (ou `refreshPriority`).
- Só `transform`, `opacity`, `clip-path` e `filter` animam; `will-change` só durante o efeito.
- Scrub com suavização (`scrub: 0.8`–`1.2`), easing `power3`/`expo`, nunca elástico.
- Conferir rolando para cima também: tudo precisa voltar sem salto.

## Movimento e acessibilidade

`prefers-reduced-motion`: sem Lenis, sem pin/scrub, sem WebGL animado. Celular: pins curtos.
Contraste AA, foco visível, `alt` em tudo, teclado. SEO: title/description, Open Graph,
JSON-LD `Attorney`, sitemap, favicon.

## Critério de pronto

`npm run build` sem erro nem aviso; capturas 1440×900 e 390×844 de cada seção sem quebra nem
rolagem horizontal; console limpo; Lighthouse mobile performance ≥ 85, acessibilidade ≥ 95.
