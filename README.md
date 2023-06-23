# Application Title

Este repositório é um **monorepo** que contém vários pacotes npm. Aqui está uma visão geral da estrutura de pastas:

```
├───.github
│   └───workflows
├───.plop
│   └───api
├───apps
│   ├───admin
│   ├───api
│   └───web
└───packages
    ├───chakra-addons
    ├───configs
    ├───core
    ├───forms
    └───tailwind-addons
```

## Apps

A pasta `apps` contém os aplicativos principais do projeto:

- `admin`: um aplicativo de gerenciamento para administradores. `(VITE react-ts)`
- `api`: um servidor backend que fornece API para o aplicativo web. `(NodeJS ts)`
- `web`: um aplicativo web que é consumido pelos usuários finais. `(NextJS ts)`

Cada aplicativo tem sua própria estrutura de pastas e arquivos de código fonte.

## Packages

A pasta `packages` contém vários pacotes npm que podem ser compartilhados entre os aplicativos ou usados de forma independente em outros projetos.

- `chakra-addons`: contém componentes adicionais para o Chakra UI, como formulários e tabelas.
- `configs`: contém arquivos de configuração do projeto.
- `core`: contém código compartilhado entre os demais pacotes.
- `forms`: contém componentes e utilidades para trabalhar com formulários, incluindo campos e contextos.
- `tailwind-addons`: contém componentes adicionais para o Tailwind CSS, como campos de formulário e formulários.

Cada pacote tem sua própria estrutura de pastas e arquivos de código fonte.

## Outros diretórios

Além disso, o repositório contém os seguintes diretórios:

- `.github/workflows`: contém os arquivos de configuração do GitHub Actions.
- `.plop/api`: contém modelos para gerar arquivos de código para a API.

## Repository Variables

| Variável/Secret | Valor de Exemplo | Descrição |
| --- | --- | --- |
| `vars.ENV_HOMOLOG` | [`/apps/api/.env.example`](./apps/api/.env.example) | Variável de ambiente a ser definida no arquivo de ambiente da aplicação |
| `vars.HOST_HOMOLOG` | `"127.0.0.1"` | Endereço IP do servidor que irá receber a implantação |
| `vars.USER_HOMOLOG` | `"root"` | Nome de usuário para autenticar no servidor |
| `vars.SERVER_DIRECTORY_HOMOLOG` | `"/var/www"` | Caminho no servidor para a pasta que irá receber os arquivos e containers da aplicação |
| `secrets.SSH_SECRET` | `""` | Chave privada SSH usada para autenticação |

## Package JSON - Scripts

| Script | Descrição |
| --- | --- |
| docker:dev:up | Inicia os serviços do banco de dados e Redis em contêineres Docker em modo de demonstração (modo de plano de fundo) usando o Docker Compose. |
| dev | Inicia o ambiente de desenvolvimento usando a biblioteca Turbo. |
| prestart:api | Executa a operação push do banco de dados do Prisma antes de iniciar a aplicação API. |
| start:api | Inicia a aplicação API em modo de produção. |
| build:api | Compila a aplicação API para JavaScript e gera os arquivos de saída na pasta `dist`. |
| clean | Remove a pasta `node_modules` em todos os diretórios do projeto e exclui o arquivo `yarn.lock`, em seguida, executa a instalação de dependências novamente. |
| db:generate | Gera os arquivos TypeScript do Prisma a partir do modelo de dados do banco de dados. |
| db:push | Aplica as alterações no banco de dados especificadas no modelo de dados do Prisma. |
| make:usecase | Cria uma estrutura básica para um caso de uso com a biblioteca Plop. |
