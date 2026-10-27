# Verificação do portfólio — 27/10/2026

## Atualização com currículo e documentação do MES

- Catálogo reduzido a cinco projetos. CydakInsta, Petisquinho e Sarahismo removidos também da composição com registros remotos; testes cobrem a reintrodução simulada.
- MES atualizado a partir do anexo técnico, mantendo card equivalente aos demais. Detalhes de rede, credenciais e regras internas do anexo não foram publicados.
- Contatos atualizados e links mailto, tel e LinkedIn conferidos no navegador.
- Currículo atualizado em DOCX e PDF de duas páginas. O documento recebido em Downloads permaneceu intacto.
- O renderizador padrão falhou por ausência de pdf2image; o runtime de artefatos/LibreOffice não estava disponível. Usado Microsoft Word instalado para gerar o DOCX e exportar o PDF. As duas páginas do PDF foram renderizadas pelo Windows.Data.Pdf e inspecionadas visualmente, sem cortes ou sobreposições.
- `npm test`: cinco testes passaram com os downloads incluídos na verificação HTTP e cabeçalhos/assinaturas dos arquivos PDF e DOCX.
- Chromium: downloads reais de PDF e DOCX concluídos com nomes corretos; cinco cards, MES, busca, filtros, remoções remotas simuladas, teclado e quatro larguras (320, 390, 768, 1440 px) passaram, sem overflow horizontal ou erros JavaScript.
- Conteúdo editável em docs/curriculo-content.json; geração via scripts/generate-resume.ps1, usando Word no Windows. Nenhum deploy executado.

## Registro da revisão inicial

- `npm test`: 5 testes passaram; sem falhas. Catálogo, normalização, busca, URLs, HTTP, falha de consulta e combinação com banco temporário.
- `node --check`: app.js, project-utils.js, server.js, api/projects.js e lib/projects.js passaram.
- `git diff --check`: sem erros.
- Chromium headless: conferidas larguras de 320, 375, 390, 768, 1024 e 1440 px; sem overflow horizontal.
- Navegador: 8 cards, filtros, busca sem acentos, estado vazio, limpeza e menu com Escape/foco passaram.
- Falhas simuladas: API indisponível mantém catálogo; ambas as fontes indisponíveis mostram erro; nova tentativa recupera os projetos.
- Conteúdo malicioso simulado: título tratado como texto e URL javascript rejeitada. Sem erros JavaScript durante o roteiro.
- Impressão: PDF A4 gerado; perfil visível, navegação oculta; eventos de impressão mostram catálogo completo e restauram os filtros após impressão.
- Movimento reduzido: rolagem automática em vez de suave.
- Screenshots desktop/mobile inspecionados. Artefatos de QA ficaram na pasta temporária do sistema, fora do projeto.

## Limites

Não foi executado deploy nem acessado banco remoto real. Os fluxos remotos foram exercitados com SQLite temporário. O MES Cydak recebeu apenas nome confirmado pelo usuário, sem stack presumida. O inventário contém os projetos verificáveis nesta revisão; completude dos projetos recentes e dados biográficos adicionais dependem das fontes do proprietário. A exportação é um perfil imprimível, sem histórico de empregos ou formação não fornecidos.
