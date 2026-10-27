# Portfolio Refresh Implementation Plan

> Execução nesta sessão, conforme autorização do usuário, sem delegação.

**Goal:** Entregar apresentação híbrida Gustavo Melo / Vulkanos e catálogo de projetos equivalentes, incluindo MES Cydak.

**Architecture:** HTML/CSS/JavaScript sem framework; catálogo JSON versionado e API compartilhada entre Express e Vercel. O catálogo local mantém a página utilizável sem banco remoto.

**Tech Stack:** Node.js, Express, @libsql/client, HTML, CSS e módulos JavaScript.

## Global Constraints

- MES Cydak sem destaque e sem stack presumida.
- Não inventar histórico profissional ou publicar detalhes operacionais privados.
- Preservar dados remotos, não executar deploy e manter alterações na branch feat/portfolio-refresh.

## Tarefa 1 — Catálogo e API

- [x] Criar public/projects.json com projetos documentados e MES Cydak apenas com identificação confirmada.
- [x] Criar public/project-utils.js com normalização, merge por título, filtro e validação de URLs HTTP/HTTPS; exportar funções puras para testes e navegador.
- [x] Compartilhar leitura remota em lib/projects.js; sem configuração usar catálogo, com falha remota manter catálogo e registrar erro sem retornar credenciais.
- [x] Atualizar api/projects.js e server.js; iniciar HTTP somente na execução direta, conservar export default e retornar 404 real para recursos inexistentes.
- [x] Testar merge, filtros, URLs maliciosas e respostas HTTP usando node:test e servidor efêmero.

## Tarefa 2 — Apresentação e interação

- [x] Reescrever public/index.html e public/style.css com navegação responsiva, apresentação pessoal, perfil imprimível, competências, contato e grade uniforme.
- [x] Atualizar public/app.js para renderização segura via DOM, busca, filtros, contador, recuperação da API, tentativas e menu acessível.
- [x] Manter logo local, fontes do sistema, links reais já confirmados e preferência de movimento reduzido.
- [x] Verificar desktop/mobile, teclado, impressão, resultados vazios e indisponibilidade da API.

## Tarefa 3 — Documentação e entrega

- [x] Atualizar README com execução, variáveis opcionais, edição do catálogo e limites do currículo/MES.
- [x] Trocar npm test por node --test; executar testes, verificações de sintaxe e git diff --check.
- [x] Registrar resultados e limitações sem publicar o site.

