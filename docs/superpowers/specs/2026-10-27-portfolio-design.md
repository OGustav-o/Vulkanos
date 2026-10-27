# Atualização do portfólio Vulkanos

## Direção aprovada

Combinar apresentação profissional de Gustavo Melo e marca Vulkanos. O MES Cydak participa da mesma grade e recebe o mesmo tratamento visual dos demais projetos, sem selo, posição fixa ou seção de destaque.

## Página

- Abertura com nome, marca e apresentação objetiva sobre desenvolvimento de software e integração industrial, apoiada nos projetos documentados.
- Navegação para apresentação, projetos, competências e contato.
- Grade responsiva de projetos com nome, descrição, tecnologias e links apenas quando confirmados. Busca por nome e filtro por área, com mensagem clara quando não houver resultados.
- Perfil profissional com competências demonstradas pelos projetos. Não inventar empregos, formação, certificações, datas ou resultados quantitativos. Oferecer impressão do perfil como currículo; não apresentar um PDF inexistente para download.
- Contato com os canais já existentes no site.

## Conteúdo e fontes

O inventário inicial encontrou BIO-T / Controle de Acesso Industrial, Sarah Beauty Stock e Vulkanos Academy, com documentação local específica. Sarahismo e Petisquinho ainda precisam de leitura do conteúdo da aplicação, pois seus READMEs descrevem templates. O repositório Vulkanos também pode integrar o catálogo como projeto deste portfólio.

O MES Cydak foi confirmado pelo usuário, mas sua documentação ainda não foi localizada. Antes de publicar detalhes, confirmar sua localização, escopo e tecnologias. Não presumir que CydakInsta seja o MES. A lista completa de projetos recentes depende dessa conferência e da validação do usuário.

## Aparência e acessibilidade

Manter identidade Vulkanos, fundo escuro e acentos em vermelho, com tipografia legível, hierarquia clara e espaçamento consistente. Cards equivalentes para todos os projetos. Adaptar navegação e grade a celulares; incluir foco visível, semântica HTML, contraste adequado e respeito à preferência por movimento reduzido.

## Estrutura e funcionamento

Preservar HTML, CSS e JavaScript sem adicionar framework. Organizar catálogo versionado em arquivo público, disponível como base quando o banco remoto não estiver configurado. Preservar projetos retornados pela API, evitando duplicação com o catálogo. Não modificar o banco remoto nesta atualização.

Corrigir inicialização local para que npm run dev abra o servidor HTTP, mantendo exportação compatível com a configuração de implantação existente. A indisponibilidade da API não pode ocultar o catálogo local. Validar dados e permitir somente URLs HTTP/HTTPS nos links externos.

## Verificação

Verificar inicialização e respostas HTTP locais, carregamento com e sem configuração remota, composição do catálogo sem duplicatas, busca/filtros, navegação por teclado, impressão e layout em telas móveis e desktop. Não publicar nem executar implantação automaticamente.

## Revisão

Escopo limitado ao portfólio atual. Direção híbrida aprovada; MES Cydak sem destaque. Conteúdo técnico e biográfico condicionado às fontes disponíveis. Próximo passo: revisão desta especificação pelo usuário antes do plano de implementação.
