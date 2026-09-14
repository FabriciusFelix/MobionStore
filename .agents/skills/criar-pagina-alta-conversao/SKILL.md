---
name: criar-pagina-alta-conversao
description: Cria landing pages de alta conversão em Inglês Britânico (en-GB) com simuladores 3D e estrutura AIDA a partir de links do AliExpress ou imagens de produtos.
---

# Skill: Criador de Páginas de Alta Conversão (British English & 3D Demos)

Use esta skill sempre que o usuário solicitar a criação ou geração de uma **landing page de alta conversão** para um produto e-commerce/dropshipping (fornecendo um link do AliExpress, imagens do produto ou especificações).

---

## 🌐 1. Idioma e Localização (British English - en-GB)

- **Código do Idioma**: `<html lang="en-GB">`
- **Ortografia Britânica**: Use obrigatoriamente grafia UK: `colour`, `favourite`, `optimised`, `specialises`, `centre`, `fulfilment`, `travelling`, `customise`.
- **Contexto e Moeda**:
  - Moeda principal: `£` (GBP).
  - Referências culturais UK quando aplicável: London Tube/Underground, bus, coffee shop, Royal Mail Tracked Delivery.

---

## 🎯 2. Diretrizes de Extração de Dados (AliExpress & Imagens)

Ao receber um **link do AliExpress** ou **imagens de produto**:
1. **Via Link do AliExpress**:
   - Use `read_url_content` ou `browser_subagent` para ler o título, fotos do produto, especificações técnicas e avaliações.
   - Identifique a promessa principal (Big Idea), o maior problema que o produto resolve e suas 6 maiores qualidades.
2. **Via Imagens**:
   - Use `view_file` para analisar os detalhes visuais do produto e criar mockups compatíveis.

---

## 🏗️ 3. Arquitetura da Página (Estrutura AIDA de Página Única)

A landing page DEVE ser construída em arquivo único (`index.html` + `styles.css` + `script.js`), sendo dividida rigorosamente nas seguintes seções:

### 📍 Bar de Anúncios e Navbar Sticky
- **Announcement Bar**: Destaque de Frete Grátis para o Reino Unido + Oferta de 40% OFF por tempo limitado com link direto para a oferta.
- **Header Navigation**: Logo com badge + links de navegação suave (`#simulator`, `#features`, `#comparison`, `#reviews`, `#faq`) + Botão Header `BUY NOW` (`href="https://mobion.store"`).

### 🔷 Bloco 1: Hero Section (AIDA: Atenção)
- Badge com classificação ★★★★★ e contagem de compradores verificados.
- Título principal impactante com gradiente de cor no benefício chave.
- Subtítulo focado em resolver a maior dor do usuário.
- 4 itens com checkmarks destacando as maiores qualidades do produto.
- **Botão CTA Principal**: `GET MY [PRODUCT] — 40% OFF` (`href="https://mobion.store"`).
- Subtexto com badges de segurança e envio rápido.
- Imagem de destaque do produto com card flutuante.

### 🔷 Bloco 2: Problema & Conscientização (AIDA: Interesse)
- Título focado em alertar o usuário sobre o risco de não usar o produto.
- Grid com 3 cards de cenários reais de dor no dia a dia.
- **Botão CTA de Bloco**: `PROTECT MY PHONE NOW AT CHECKOUT →` (`href="https://mobion.store"`).

### 🔷 Bloco 3: Simulador 3D Interativo (AIDA: Interesse & Desejo)
- **Palco 3D do Produto**: Mockup interativo em CSS/JS com suporte a rotação 3D física via `perspective` e `transform: rotateY()`.
- **Controle por Range Slider**: Ao arrastar a barra de 0° a 45°, o produto gira fisicamente em 3D e altera dynamicamente o efeito visual (ex: opacidade da tela de privacidade ou transição de ângulos).
- Badge de status dinâmico que atualiza em tempo real conforme o ângulo do slider.
- **Botão CTA de Bloco**: `CLAIM THIS TECHNOLOGY AT CHECKOUT →` (`href="https://mobion.store"`).

### 🔷 Bloco 4: Qualidades Exclusivas do Produto (AIDA: Desejo)
- Grid com 6 cards de qualidades detalhadas com ícones personalizados.
- Foco absoluto em durabilidade, engenharia, facilidade de uso e benefícios práticos.
- **Botão CTA de Bloco**: `BUY MOBION PRIVACY GLASS NOW →` (`href="https://mobion.store"`).

### 🔷 Bloco 5: Tabela Comparativa de Qualidade (AIDA: Desejo)
- Tabela comparativa contrastando o Produto vs Alternativas Comuns do Mercado vs Produtos Baratos.
- Destaque visual exclusivo na coluna do produto com bordas brilhantes e gradientes.
- **Botão CTA de Bloco**: `CHOOSE THE BEST PROTECTION AT CHECKOUT →` (`href="https://mobion.store"`).

### 🔷 Bloco 6: Oferta Especial & Caixa de Checkout (AIDA: Ação)
- Contador regressivo em tempo real (`14:59`).
- Card de Checkout com badge de Kit Recomendado, lista de benefícios e caixa de preço (*Was £29.90 / Now £17.90*).
- **Botão CTA de Checkout Principal**: `PROCEED TO CHECKOUT & COMPLETE ORDER →` (`href="https://mobion.store"`).
- Badges de pagamento seguro 256-Bit SSL e garantia.

### 🔷 Bloco 7: Avaliações de Clientes (Social Proof)
- Grid com 3 avaliações realistas de clientes do Reino Unido com avatares e selo de compra verificada.
- **Botão CTA de Bloco**: `GET MY MOBION PRIVACY GLASS NOW →` (`href="https://mobion.store"`).

### 🔷 Bloco 8: Perguntas Frequentes (FAQ Accordion)
- Sanfona interativa em JavaScript que expande/recolhe respostas sobre entrega, aplicação e garantia.
- **Botão CTA de Bloco**: `SECURE MY PRIVACY GLASS WITH FREE DELIVERY →` (`href="https://mobion.store"`).

### 📍 Rodapé Completo
- Informações da marca, navegação rápida, dados de atendimento e ícones de pagamento (Visa, Mastercard, Apple Pay, Google Pay, PayPal).

---

## ⚡ 4. Regra de Ouro da Conversão (Botão em Cada Bloco)

> **CADA UM DOS BLOCOS DA PÁGINA DEVE OBRIGATORIAMENTE CONTER UM BOTÃO DE COMPRA/CHECKOUT** direcionando o usuário para o link da loja (`https://mobion.store`). Nunca deixe uma seção sem uma chamada para ação clara.

---

## 💻 5. Padrões de Código e Animações CSS

- **CSS Variables**: Utilize tokens modernos (`--accent-cyan`, `--bg-main`, `--font-heading`, `--radius-lg`).
- **Design Escuro de Luxo**: Dark mode com iluminação radial, glassmorphism e bordas brilhantes (`backdrop-filter`, `box-shadow`).
- **Animações Fluidas**: Micro-interações em botões (`transform: translateY(-3px)`), efeitos de hover em cards e transição suave no simulador 3D.
- **Git Commit**: Quando salvar alterações, utilize Conventional Commits em português (ex: `feat: criacao da pagina de alta conversao em ingles britanico`).
