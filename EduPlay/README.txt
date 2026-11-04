EDUPLAY — PROTÓTIPO

COMO ABRIR
1. Extraia a pasta EduPlay.
2. Abra a pasta no Visual Studio Code.
3. Abra index.html com a extensão Live Server (ou abra o arquivo no navegador).

O QUE JÁ TEM
- Cadastro de aluno por nome e e-mail (protótipo local).
- Ranking sem nomes fictícios: só aparecem pessoas cadastradas.
- 30 perguntas iniciais de Química.
- Painel do professor para criar quantas perguntas quiser:
  * marcar alternativa (4 opções e gabarito);
  * resposta escrita, com linhas para o aluno responder na atividade impressa.
- Impressão da atividade criada.

IMPORTANTE SOBRE O CADASTRO E O RANKING
Esta é a primeira versão visual/funcional, ainda sem banco de dados online.
Os dados ficam no localStorage do navegador. Isso significa que o cadastro feito em um computador
não aparece automaticamente no celular ou no computador de outro aluno.
Para o ranking ser compartilhado por toda a turma, precisamos integrar o Supabase:
Auth para contas reais e tabelas para perfis, atividades, perguntas, respostas e pontuação.
Não coloque chave service_role no JavaScript do navegador.

PRÓXIMA ETAPA
Configurar o projeto Supabase, criar as tabelas e as políticas de segurança (RLS), depois ligar
o cadastro, login, perguntas e ranking ao banco online.
