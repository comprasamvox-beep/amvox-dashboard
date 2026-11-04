---
name: compras-nacionais-amvox
description: Use quando Jéssica enviar o CSV do Protheus (pedidos de compra ou SCs) para atualizar a planilha Compras Nacionais Amvox 2026 e o dashboard publicado no GitHub/Vercel.
---
# Atualizar Dashboard de Compras Nacionais — Amvox 2026

Fluxo padrão: Jéssica extrai o relatório do Protheus (CSV) e envia no chat. Claude atualiza a planilha `Compras_Nacionais_Amvox_2026.xlsx` e o dashboard oficial (https://amvox-dashboard.vercel.app/), publicando direto no repositório `comprasamvox-beep/amvox-dashboard`. O app do Claude no GitHub já está instalado, então NÃO pedir token.

Responder sempre em português do Brasil, de forma objetiva.

## 1. Identificar o tipo de CSV
- **Pedidos de compra**: alimenta a aba `Pedido de Compra` e o array `rows` do dashboard.
- **Solicitações de compra (SC)**: alimenta a aba de SCs em aberto e o array `scs` (+ data em `scs_atualizado`).
- Se não der para identificar, perguntar.
- Ler o CSV com o encoding correto (latin-1/cp1252, separador `;`, decimal com vírgula). Conferir os acentos antes de seguir.

## 2. Atualizar a planilha
- A planilha tem só a aba **Pedido de Compra** (livre para editar) e a aba de **SCs em aberto**. Resumos e análises ficam no dashboard.
- Manter as colunas **Nº SC** e **Condição de Pagamento**. Onde não houver informação, deixar em branco.
- Manter a coluna que informa se o material foi **entregue conforme o pedido** (qualidade do fornecedor). Pedidos anteriores ficam como conformes; a avaliação vale a partir dos novos pedidos.
- Itens repetidos (mesmo pedido + código) são NORMAIS, principalmente em serviços. Não remover nem tratar como duplicidade.
- Entregar a planilha atualizada no chat (Jéssica salva no OneDrive dela).

## 3. Atualizar o dashboard (index.html)
1. Clonar `https://github.com/comprasamvox-beep/amvox-dashboard.git`.
2. Os dados ficam no bloco `<script id="app-data" type="application/json">`. Substituir SOMENTE esse JSON, via script Python, nunca redigitando à mão.
3. Atualizar o texto "Gerado em" (`id="meta-gerado"`) com data e hora de Brasília (DD/MM/AAAA HH:MM).
4. NÃO alterar layout, estilo nem lógica, a menos que ela peça.

### Padrões que devem ser preservados
- Estilo: paleta navy/âmbar/teal, layout "ticket/nota de pedido", fontes Space Grotesk + Inter + IBM Plex Mono.
- Filtros: mês, status, centro de custo, fornecedor e busca, com autocomplete (inclusive Pedido, Nota Fiscal e Chamado).
- Painel de destaque do pedido (descrição em evidência + observação), que abre ao selecionar um pedido ou clicar numa linha.
- Resumo do pedido mostra número da NF e condição de pagamento.
- Ordem das seções: filtros, KPIs, detalhamento dos pedidos, acompanhamento de entregas, gráficos. Controle de SCs incluído.
- Resumo de qualidade (nota e percentual por fornecedor) aparece somente no dashboard.

## 4. Validar antes de publicar
- Abrir o `index.html` no navegador (Playwright) e conferir que não há erro e que KPIs, tabela e gráficos aparecem.
- Comparar com a versão anterior: quantidade de linhas, total em R$, pedidos novos e finalizados. Avisar diferenças grandes antes de publicar.

## 5. Publicar
- Commit na branch `main` com a mensagem `Atualiza dados – DD/MM/AAAA` e push. O Vercel publica sozinho em cerca de 1 minuto.
- Responder com um resumo curto: nº de pedidos e itens, valor total, novidades (atrasos, SCs em aberto) e o link https://amvox-dashboard.vercel.app/.

## Observações
- A leitura direta do OneDrive (`api/planilha.js`) não está em uso, porque o TI não autorizou o link.
- Se o push falhar por permissão, avisar Jéssica para verificar o app do Claude no GitHub. Não pedir token no chat.
