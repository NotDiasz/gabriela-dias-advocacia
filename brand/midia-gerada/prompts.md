# Prompts e Especificação de Mídia — Gabriela Dias Advocacia

**Data:** 2026-10-28  
**Autorização:** Miguel (2026-10-28) — Tratamento em alta resolução da fotografia original da cliente (`brand/fotos/gabriela-original.png`) mantendo fidelidade estrita à identidade facial, sorriso, proporções e joias, com substituição do fundo de folhagens por estúdio em marfim/nude e trajes elegantes de alfaiataria neutra. Geração dos 4 objetos de apoio do site com iluminação quente, isolamento e transparência.  
**Ferramentas:** Image Generation integrada (Gemini / Vertex), `rembg` (modelo de alta precisão `bria-rmbg-2.0`), Pillow 12.2.0 (reamostragem Lanczos, enquadramento 4:5 nativo, matrizes alfa e canais RGBA/WebP Q90).

---

## 1. Retratos de Gabriela Dias

### Referência estrita de identidade:
- **Arquivo de origem:** `C:\Users\Miguel\orca\projects\gaby-advogada\brand\fotos\gabriela-original.png` (594 × 643 px, RGB).
- **Traços preservados:** Rosto oval jovem, sorriso aberto e acolhedor com dentes superiores aparentes, formato e arqueamento natural das sobrancelhas, nariz sutilmente arrebitado, olhos castanho-claros / avelã, cabelos louros dourados longos e ondulados com divisão central, e o colar de elos dourados (paperclip link chain).
- **Substituição de cenário:** Remoção do fundo escuro de folhagens noturnas; inserção de ciclorama liso de estúdio fotográfico nas cores marfim e nude da paleta da marca (`#F4EEE6` / `#E7D3C7`).
- **Iluminação:** Luz suave de estúdio 85mm com luz principal quente vinda de cima à esquerda e sombras sutis de contato.

---

### Retrato V1 — Blazer Creme / Marfim (Versão Selecionada para a Home)

- **Arquivo original gerado:** `brand/midia-gerada/retrato/gabriela-retrato-v1-original.png` (896 × 1200 px)
- **Arquivo final tratado:** `brand/midia-gerada/retrato/gabriela-retrato-v1.png` (1600 × 2000 px, proporção 4:5)
- **Exportação pública:** `public/media/gabriela-retrato.webp` (1600 × 2000 px, 4:5, Q90)
- **Recorte transparente:** `public/media/gabriela-recorte.webp` e `public/media/gabriela-recorte.png` (1600 × 2000 px, canal alfa límpido do peito para cima)

**Prompt:**
```text
Strict identity preservation portrait of the woman in the reference photo (Gabriela Dias). High-end editorial studio photography, 85mm lens. Retain her exact facial structure, exact warm radiant wide smile with upper teeth showing, natural nose, warm brown/hazel eyes, defined soft eyebrows, and center-parted long wavy golden-blonde hair falling over shoulders. Preserve her delicate gold link chain necklace. Replace the dark green leaf background with an elegant, smooth, solid warm ivory and soft nude studio backdrop (#F4EEE6 / #E7D3C7) with soft warm ambient lighting. Complete the bust with an elegant, tailored luxury cream/ivory blazer or silk blouse, perfectly fitted and professional. Natural skin texture with fine detail, sharp focus, no artificial airbrushing, warm soft light from upper left. Strictly true to her real identity.
```

**Justificativa da escolha:**
O blazer marfim/creme sobre a blusa de seda cria harmonia imediata com a base clara do site (`--color-marfim: #F4EEE6`), contrastando de forma suave e sofisticada. O recorte transparente integra-se com perfeição ao Hero, permitindo que a luz radial nude e a tipografia "Dias" em Cormorant itálico fiquem visíveis por trás sem cortes bruscos ou sombras pesadas.

---

### Retrato V2 — Alfaiataria Café / Seda Champagne

- **Arquivo original gerado:** `brand/midia-gerada/retrato/gabriela-retrato-v2-original.png` (896 × 1200 px)
- **Arquivo final tratado:** `brand/midia-gerada/retrato/gabriela-retrato-v2.png` (1600 × 2000 px, proporção 4:5)

**Prompt:**
```text
Strict identity preservation portrait of Gabriela Dias from the reference photo. High-end editorial studio portrait, 85mm lens. Retain her exact recognizable face: same warm radiant open smile showing her upper teeth, same nose and cheekbones, warm brown/hazel eyes, defined natural eyebrows, same center-parted long wavy golden-blonde locks framing her face, and her delicate gold link chain necklace. Do not alter or over-smooth facial features. For attire, she wears an elegant luxury deep coffee-brown (#241A17) tailored suit jacket over a champagne/cream silk camisole. Background is a seamless, soft, solid warm nude/marfim (#F4EEE6 / #E7D3C7) studio backdrop with gentle directional warm key light from upper-left creating soft subtle shadows. Ultra-realistic skin texture, crisp detail, no AI plastic look, authentic and true to her original appearance.
```

---

## 2. Objetos Isolados (Packshots 3D / Fotográficos)

Todos os objetos foram gerados sobre fundo branco puro (`#FFFFFF`) com iluminação direcional quente vinda de cima à esquerda, seguindo a paleta oficial: Marfim (`#F4EEE6`), Café (`#241A17`), Bordô (`#7A1F2B`), Champagne (`#C9A97A`) e Nude (`#E7D3C7`). O fundo foi removido com precisão milimétrica via `rembg`, gerando canal alfa nítido e preservando refrações de cristal, transparências e fibras.

### 2.1. Tinteiro de Cristal Lapidado com Tinta Bordô e Pena (`tinteiro`)
- **Seção de uso:** Manifesto 1 — `ESCUTA ATENTA.` (A gota de tinta bordô cai e encerra o manifesto).
- **Originais:** `brand/midia-gerada/objetos/tinteiro-original.png` e `tinteiro.png` (1600 × 1600 px)
- **Exportação pública:** `public/media/objetos/tinteiro.webp` (1600 × 1600 px, com canal alfa)

**Prompt:**
```text
Studio product photograph of a luxury antique cut crystal inkwell (tinteiro) filled with rich deep burgundy wine-red ink, featuring ornate polished gold-brass hinged lid and filigree accents. Next to the inkwell rests an elegant vintage dip quill pen with a sleek dark feather and detailed golden nib. Warm directional studio lighting from upper-left casting soft subtle contact shadows. Crisp optical reflections and refractions through the heavy faceted crystal glass. Pure solid white background (#FFFFFF), clean seamless studio isolation, ultra-sharp focus, photorealistic 8k commercial packshot.
```

---

### 2.2. Chave Antiga de Latão Champagne com Fita de Seda Bordô (`chave`)
- **Seção de uso:** Manifesto 2 — `CLAREZA EM CADA PASSO.` (A chave gira 90° e abre a transição de revelação da marca).
- **Originais:** `brand/midia-gerada/objetos/chave-original.png` e `chave.png` (1600 × 1600 px)
- **Exportação pública:** `public/media/objetos/chave.webp` (1600 × 1600 px, com canal alfa)

**Prompt:**
```text
Studio packshot product photograph of an ornate luxury antique skeleton key forged from warm champagne-toned brass and gold patina (#C9A97A). An exquisite, rich deep burgundy wine-red silk ribbon (#7A1F2B) is tied through the ornate bow of the key with graceful flowing folds. Photographed on a pure solid seamless white studio background (#FFFFFF). Warm directional studio lighting from the upper-left casting soft subtle contact shadows beneath the key. Elegant Old Money aesthetic, hyper-realistic metallic texture, subtle specular highlights on brass carvings, photorealistic 8k packshot, perfectly isolated.
```

---

### 2.3. Envelope de Papel Marfim com Lacre Bordô GD (`envelope`)
- **Seção de uso:** Seção Contato — "Vamos conversar sobre o seu caso." (O envelope entra com efeito de carimbo e a aba se desdobra).
- **Originais:** `brand/midia-gerada/objetos/envelope-original.png` e `envelope.png` (1600 × 1600 px)
- **Exportação pública:** `public/media/objetos/envelope.webp` (1600 × 1600 px, com canal alfa)

**Prompt:**
```text
Studio packshot product photograph of a luxury bespoke stationery envelope crafted from heavy textured warm ivory/cream cotton paper (#F4EEE6). The back flap of the envelope is closed and sealed with an authentic melted round sealing wax stamp in rich deep burgundy wine-red (#7A1F2B). Clearly embossed/impressed in the center of the burgundy wax seal is an elegant monogram of the intertwined letters 'GD' (Cinzel/serif luxury typography). Crisp paper fibers, fine deckled edge, Old Money luxury stationery aesthetic. Warm directional studio lighting from the upper-left casting soft subtle contact shadows beneath the envelope. Photographed on a pure solid seamless white studio background (#FFFFFF), sharp focus, photorealistic 8k commercial packshot, isolated.
```

---

### 2.4. Anel-Sinete de Ouro Champagne em 3/4 com Monograma GD (`anel`)
- **Seção de uso:** Seção A Marca — Fallback estático da experiência 3D WebGL em three.js.
- **Originais:** `brand/midia-gerada/objetos/anel-original.png` e `anel.png` (1600 × 1600 px)
- **Exportação pública:** `public/media/objetos/anel.webp` (1600 × 1600 px, com canal alfa)

**Prompt:**
```text
Studio packshot product photograph of an ultra-luxurious bespoke heavy signet ring (anel-sinete) crafted from solid warm champagne gold (#C9A97A) with a satin-brushed and polished finish. Viewed in a dramatic three-quarter (3/4) perspective angle. The flat oval bezel face of the signet ring features a deep, crisp, masterfully engraved monogram of the intertwined letters 'GD' (Cinzel / classical serif typography). Realistic subtle metallic reflections, light skims the beveled golden edges. Warm directional studio lighting from the upper-left casting soft subtle contact shadows beneath the ring. Photographed on a pure solid seamless white studio background (#FFFFFF), sharp optical focus, photorealistic 8k commercial jewelry packshot, perfectly isolated.
```

---

## 3. Validação e Qualidade Visual

- **Folha de Comparação:** `brand/midia-gerada/retrato/comparacao.jpg` (2560 × 1240 px) reúne lado a lado a fotografia original da cliente, a versão V1 (escolhida) e a versão V2, com indicação de tokens da paleta e evidência de fidelidade fisionômica.
- **Folha de Validação de Fundos:** `brand/midia-gerada/validacao-fundos.jpg` (2400 × 1600 px) testa todos os recortes com transparência (retrato e 4 objetos) sobre o fundo marfim oficial (`#F4EEE6`) e sobre o fundo escuro café (`#241A17`), comprovando ausência de bordas brancas, artefatos, halos ou serrilhado.
