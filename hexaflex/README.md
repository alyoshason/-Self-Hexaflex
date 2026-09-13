# Mapa de Flexibilidade Psicológica — Hexaflex

Aplicação em português brasileiro com Next.js 16.3.4, App Router, React, TypeScript e CSS Modules. Exportação estática, sem backend, autenticação ou serviços externos. O conteúdo clínico fornecido foi preservado.

## Executar

Com Node.js 20.9 ou superior e pnpm:

```sh
pnpm install
pnpm dev
```

Abra http://127.0.0.1:3000. Para verificar o projeto:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O build gera `out/`, que pode ser servido por qualquer servidor estático. Como o projeto utiliza `output: 'export'`, use um servidor estático para pré-visualizar a produção, não `next start`.

## Publicar na Vercel

Importe esta pasta como projeto Next.js, mantenha `pnpm build` como comando de build e use a saída estática `out/`. Nenhuma variável de ambiente é necessária. Esta entrega não publica o site nem cria uma conta na Vercel.

## Estrutura

- `lib/content.ts`: 26 itens, descrições e textos clínicos, separados da interface.
- `lib/scoring.ts`: médias sem arredondamento prematuro, mínimos de respostas e formatação.
- `lib/geometry.ts`: hexágono flat-top, anéis e setores proporcionais.
- `components/Hexaflex.tsx`: SVG interativo e acessível por teclado.
- `app/page.tsx`: fluxo, estado temporário, reflexão e download SVG.
- `app/page.module.css`: estilos da aplicação; `app/globals.css`: base global.
- `tests/core.test.tsx`: onze testes de conteúdo, cálculo, estilos, empates e geometria/renderização.
- `components/ResponseReport.tsx`: resumo descritivo e processos ordenados pela disponibilidade relatada.
- `app/fonts/`: fontes Lora e Inter e suas licenças SIL Open Font License; carregadas localmente com `next/font/local`.

## Decisões

- O slider nativo requer um valor interno. Antes da interação, a resposta permanece `undefined`, o marcador fica invisível e o leitor de tela recebe “Sem resposta”. O número interno não participa do cálculo. Setas, Home/End e interação por toque/mouse definem a resposta; Enter ou Espaço permitem escolher o ponto central.
- N/A nunca entra no denominador. São necessárias 2 respostas numéricas em processos de 3 itens e 3 em processos de 5 itens.
- O escore não é arredondado antes do desenho. Exibe-se uma casa decimal, com vírgula.
- Cada preenchimento é um triângulo semelhante ao setor completo, com extensão radial `média / 10`. Consequentemente, escore 5 ocupa metade do raio e um quarto da área — conforme a especificação, não metade da área.
- Dados insuficientes usam hachura e texto, sem serem convertidos em zero. Por solicitação posterior, Aberto, Centrado e Engajado também exibem a média dos dois processos de cada par, com pesos iguais. A nota só existe quando ambos os processos têm dados suficientes; não se calcula escore geral. Essas médias são um resumo descritivo adicional, sem validação psicométrica.
- O relatório ordena os processos pela nota exibida com uma casa decimal, agrupa empates e exclui dados insuficientes. Descreve disponibilidade relatada no período, sem inferir desenvolvimento clínico ou prioridades de tratamento. “Ocultar números” também oculta as notas dos estilos e do relatório.
- A exportação é SVG, abrível em navegadores e editores vetoriais. Inclui data local, título, gráfico, seis escores e nota. Mesmo com números ocultos na tela, os seis escores constam na imagem; a interface informa isso.
- Nenhuma resposta usa armazenamento, URL, cookies, analytics ou rede. O estado é mantido apenas em memória; recarregar e refazer apagam tudo. O site possui `noindex, nofollow`. A carga inicial dos arquivos do site é a única comunicação necessária em produção.
- TypeScript 6 e ESLint 9 foram usados por compatibilidade com o conjunto de lint do Next.js instalado. O lockfile registra as versões resolvidas.

## Verificação realizada

- Lint, typecheck, onze testes unitários e build de produção.
- Navegador Edge/Chromium: fluxo completo, teclado, bloqueio de itens pendentes, preservação ao voltar, N/A, ocultação de números, exploração por setor, download, refazer e recarregar.
- Revisão visual a 360 × 800 e 1280 × 1000, incluindo questionário e resultado. O gráfico ocupa toda a largura disponível, com rótulos HTML ao redor. O painel de exploração aparece abaixo e fecha ao selecionar novamente o processo ou usar “Voltar ao mapa”. O slider tem onze marcações, âncoras textuais alinhadas e valor numérico apenas após interação.
- Exportação inspecionada: seis escores presentes, sem os itens e sem a reflexão. Armazenamento local e cookies vazios.

A acessibilidade recebeu verificação de teclado, nomes programáticos, foco visível e alternativas textuais. Não foi realizada uma auditoria formal WCAG nem uma sessão com leitor de tela real. A ferramenta não é uma escala psicométrica validada e não produz diagnóstico.

## Identidade visual e assinatura

A tela inicial e o rodapé incluem Rafael Ramos Amaral e o link https://www.rafaelramospsiquiatra.com, aberto em outra aba sem transmitir respostas ou parâmetros. Nome, URL e descrições dos pares estão em `lib/content.ts`. O questionário tem navegação inferior persistente em mobile, orientação para sliders sem resposta e contraste reforçado. A exportação mantém os rótulos vetoriais e todos os escores independentemente da ocultação na interface.
