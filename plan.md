# RiskGuard — plano de implementação e design

## Escopo

Construir um verificador pré-transação em português do Brasil para carteiras e contratos. A interface precisa demonstrar cinco sinais on-chain, classificar o risco em baixo/médio/alto, explicar as bandeiras em linguagem simples, mostrar um exemplo limpo e um exemplo problemático, oferecer uma recomendação prática e gerar um resumo compartilhável.

A primeira versão usa dados de demonstração locais para garantir uma apresentação confiável sem inventar acesso a uma API on-chain real. O texto explicita quando o resultado é uma demonstração; a arquitetura deixa a camada de consulta isolada para posterior conexão a um indexador.

## Implementação

- React + TypeScript no frontend, usando o starter web-db-user já inicializado.
- Uma página principal em `client/src/pages/Home.tsx` com consulta, atalhos de exemplos e painel de resultado.
- Dados tipados e funções de análise locais para cinco sinais: idade, código verificado, endereços sinalizados, aprovações incomuns e movimentação recente.
- Estado de consulta, carregamento, compartilhamento via Clipboard API e feedback visual com Sonner.
- `public/manus-routes.json` com a rota `/`.
- `server/routers.ts` permanece pronto para receber o indexador; nenhuma credencial externa é necessária para a demo.
- Vídeo curto separado em MP4, mostrando uma jornada visual de consulta até recomendação.

## Design

### Alternativas consideradas

1. Neobrutalismo de auditoria — probabilidade 0,06.
2. Console cripto neon — probabilidade 0,08.
3. **Escolhida: editorial de segurança com precisão operacional — probabilidade 0,86.**

### Movimento

Editorial fintech contemporâneo, com linguagem visual de relatório de segurança: base marfim, blocos de navy profundo e acentos azul-elétrico/laranja de alerta. O produto deve parecer uma ferramenta de decisão, não um dashboard genérico.

### Princípios centrais

- Evidência antes de opinião: todo nível de risco tem sinais identificáveis.
- Legibilidade calma: poucos elementos por vez, hierarquia tipográfica forte.
- Ação explícita: cada resultado termina em um próximo passo compreensível.
- Confiança sem alarmismo: risco alto é direto, mas sempre acompanhado de explicação.

### Filosofia de cor

Marfim e branco dão sensação de documento auditável. Navy ancora a confiança e cria contraste. Azul elétrico marca a ação e os pontos verificados. Verde-lima comunica sinal limpo; laranja vivo sinaliza atenção; vermelho coral é reservado para risco alto.

### Paradigma de layout

Composição assimétrica em duas colunas: narrativa e identidade do produto à esquerda, área de decisão à direita. O resultado ocupa uma faixa ampla abaixo do scanner, como uma ficha de auditoria que pode ser lida de cima para baixo.

### Elementos de assinatura

- Marca triangular “RG” com três barras horizontais, sugerindo filtro e proteção.
- Etiqueta vertical “PRÉ-TRANSAÇÃO” no painel de scanner.
- Cartões de evidência com linha de progresso e microcopy em vez de gráficos decorativos.

### Interação e animação

O campo de endereço recebe foco claro; exemplos preenchidos dão sensação de atalho e tornam a demo imediata. Durante a consulta, o botão mostra uma varredura curta e o painel usa entrada suave. O resultado revela primeiro o veredito, depois os sinais, depois a recomendação.

### Tipografia

Usar `DM Sans` para corpo e controles, com `Space Grotesk` para títulos e métricas. Títulos compactos em caixa normal, números grandes com peso 700. Labels e metadados em caixa alta com tracking amplo.

### Essência e voz

**Posicionamento:** o filtro de segurança que ajuda qualquer pessoa a decidir antes de assinar uma transação. Personalidade: criteriosa, direta, protetora.

Voz: “Veja os sinais antes de assinar.” e “Risco não é opinião — é contexto para decidir melhor.”

### Wordmark e cor proprietária

Wordmark `riskguard` em minúsculas, acompanhado do símbolo triangular RG; a cor proprietária é azul elétrico `#365BFF`, usada apenas em ações e dados positivos.

## Estrutura de arquivos

- `client/src/pages/Home.tsx`: experiência completa da consulta e do relatório.
- `client/src/index.css`: tokens, layout responsivo, componentes visuais e microinterações.
- `client/src/App.tsx`: roteamento principal.
- `client/public/manus-routes.json`: manifesto de rotas.
- `app.config.ts`: metadados de logo do projeto.
- `plan.md` e `TODO.md`: decisões e critérios do produto.
