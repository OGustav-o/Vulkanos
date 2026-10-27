# Vulkanos · Gustavo Melo

Portfólio profissional e apresentação da marca Vulkanos. HTML, CSS e JavaScript sem framework, com Express e integração opcional ao Turso.

## Executar

Requer Node.js 18 ou superior e npm.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. No PowerShell, para outra porta:

```powershell
$env:PORT = '3100'
npm run dev
```

O servidor inicia tanto com `npm run dev` quanto com `npm start`. A exportação do Express permanece disponível para a configuração Vercel existente.

## Projetos

Edite `public/projects.json`. Cada projeto tem este formato:

```json
{
  "title": "Nome do projeto",
  "category": "Aplicações web",
  "description": "Problema e funcionalidades confirmadas do projeto.",
  "tech": ["JavaScript", "Node.js"],
  "repository": "https://github.com/usuario/repositorio",
  "demo": "https://exemplo.com"
}
```

`repository` e `demo` são opcionais; links sem destino confirmado devem ser omitidos. Apenas URLs HTTP/HTTPS sem credenciais são aceitas. As áreas dos filtros são geradas a partir do catálogo. A busca considera título, descrição e tecnologias, sem diferenciar acentos ou maiúsculas.

O catálogo inclui BIO-T, Sarah Beauty Stock, Vulkanos Academy, MES Cydak e o próprio portfólio. A documentação fornecida pelo proprietário fundamenta o resumo do MES: telemetria IIoT multimarcas, arquitetura Edge-to-Server, C#/.NET 10, Blazor Server, SQLite e reenvio de lotes após falhas de conexão. O projeto recebe o mesmo tratamento visual dos demais.

CydakInsta, Petisquinho e Sarahismo foram removidos a pedido do proprietário. A exclusão em `public/project-utils.js` também impede a reintrodução por registros legados do banco remoto, sem apagar registros desse banco.

Outros projetos recentes que não estejam neste inventário devem ser acrescentados após confirmação de nome, escopo e conteúdo autorizado para divulgação. Não há métricas, empregos, formação ou certificações presumidos no perfil.

## Banco remoto opcional

Sem variáveis de ambiente, `/api/projects` retorna o catálogo local. Para consultar também o Turso, configure no ambiente do processo ou no painel Vercel:

```text
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu-token
```

O servidor não carrega `.env` automaticamente. Não coloque credenciais no frontend nem no Git. A tabela remota existente pode manter as colunas `id`, `title`, `tech` e `description`; `tech` aceita texto separado por vírgulas. Campos `category`, `repository` e `demo` também são aceitos quando disponíveis.

O catálogo local é combinado com os registros remotos, removendo títulos repetidos (sem diferenciar acentos, maiúsculas e espaços nas extremidades). Em duplicatas, a versão local revisada tem prioridade. Registros exclusivamente remotos continuam visíveis em `Outros projetos` quando não possuem área. Nenhuma tabela ou registro remoto é alterado por esta aplicação.

Falhas no banco preservam o catálogo local. Se a API falhar no navegador, o frontend usa `/projects.json`; se ambas as fontes falharem, apresenta um botão para tentar novamente.

## Perfil e impressão

O site oferece download direto do currículo atualizado em `public/downloads/curriculo-gustavo-melo.pdf` e `public/downloads/curriculo-gustavo-melo.docx`. Ambos têm duas páginas e foram preparados com o currículo enviado pelo proprietário, os projetos verificados e a documentação do MES. Experiência e formação no perfil também foram atualizadas com essa fonte. Contatos: `gustavo.melo67@outlook.com`, `(11) 94834-0020` e `https://www.linkedin.com/in/gustavo777/`.

Para editar o conteúdo, altere `docs/curriculo-content.json`. Para regenerar os arquivos no Windows com Microsoft Word instalado, execute `powershell -ExecutionPolicy Bypass -File scripts/generate-resume.ps1`. O script abre sua própria instância invisível do Word e preserva o documento original recebido. Após regenerar, confira as páginas antes de publicar. Datas e nível das competências devem ser mantidos conforme confirmação do proprietário.

O botão **Imprimir perfil / Salvar PDF** permanece como alternativa para imprimir a página do portfólio, com todos os projetos, independentemente do filtro ativo. Os downloads do currículo são arquivos próprios e não dependem da impressão do navegador.

## Estrutura

- `public/index.html`: apresentação, perfil, competências e contato.
- `public/style.css`: identidade visual, layouts responsivos e impressão.
- `public/app.js`: catálogo, busca, filtros, menu e recuperação de erros.
- `public/project-utils.js`: normalização, composição do catálogo, busca e URLs.
- `public/projects.json`: conteúdo versionado dos projetos.
- `public/downloads/`: currículo PDF e Word disponibilizado no site.
- `docs/curriculo-content.json`: conteúdo editável do currículo.
- `scripts/generate-resume.ps1`: geração de DOCX e PDF usando Word no Windows.
- `lib/projects.js`: leitura local e consulta remota com recuperação de falhas.
- `api/projects.js`: handler compartilhado por Express e função Vercel.
- `server.js`: arquivos estáticos e inicialização HTTP local.
- `tests/projects.test.js`: testes de catálogo, API e integração.

## Verificação

```sh
npm test
node --check public/app.js
node --check server.js
```

Os testes usam `node:test`, uma porta efêmera e um banco temporário, sem acessar ou modificar o banco remoto real. Incluem deduplicação, dados legados, busca, URLs inseguras, fallback, métodos HTTP e arquivos estáticos. No Windows, a limpeza do banco temporário usa novas tentativas para tolerar bloqueios transitórios de arquivo.

A interface respeita movimento reduzido, tem foco visível, link para pular ao conteúdo, filtros com estado acessível e menu mobile com fechamento por Escape. O catálogo exige JavaScript; os demais conteúdos são HTML estático.

## Publicação

A configuração Vercel existente foi preservada. Configure as variáveis do Turso apenas se desejar consultar o banco. Faça a revisão dos textos, contatos e projetos antes de publicar. Esta atualização não executa deploy.
