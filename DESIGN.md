# Direção visual

Fonte de verdade: `docs/design/2026-10-28-site-gabriela-dias.md` no repositório principal.

O site é uma apresentação editorial em marfim, café, bordô, champagne e nude. Títulos usam Cormorant Garamond; etiquetas, Cinzel; texto, Jost; assinatura aprovada, Monsieur La Doulaise. A fonte da assinatura pode ser trocada com `npm run signature -- --font allura` (ou `great-vibes`, `mrs-saint-delafield`, `monsieur-la-doulaise`).

Apenas o ponto do i de Gabriela é bordô, ampliado em 1,7× e levemente elevado conforme o kit aprovado; o ponto de Dias permanece café. O ponto conecta assinatura, manifestos, caminho do processo e lacre. Cada seção tem um mecanismo próprio, concentrado em `src/scripts/motion/`. Desktop usa pins longos na marca e no cilindro; celular limita pins a 150vh e usa scroll-snap nas áreas. Movimento reduzido preserva todo o conteúdo estático.

As mídias públicas seguem o contrato de nomes. O componente `Media` verifica sua presença no build e emite um bloco nude se faltarem. `Logo` incorpora os SVGs oficiais de `brand/logo/` e mantém o GD em texto como fallback. `SITE_URL` configura canonical e URLs do sitemap quando houver domínio confirmado.


