# Port-Louis QA

Este projeto utiliza **Jest** e **Puppeteer** para automação de testes em Node.js.

## Estrutura do Projeto

- **`/node_modules`**: Diretório onde ficam as dependências do projeto instaladas pelo npm.
- **`package.json`**: Arquivo de configuração do projeto que define dependências e scripts.
- **`tests/`**: Contém os arquivos de teste automatizados.
  - Exemplo: `github.test.js`.
- **`.env`**: Arquivo para armazenar variáveis de ambiente sensíveis como credenciais.

## Como instalar o projeto

### Requisitos

- Node.js (versão 16 ou superior).
- Gerenciador de pacotes npm (instalado junto com o Node.js).

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd port-louis-qa
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```plaintext
   EMAIL=<seu_email>
   PASSWORD=<sua_senha>
   GITHUB_USER=<seu_usuario_github>
   ```

## Como executar os testes

Para rodar os testes automatizados:
```bash
npm test
```

### Estrutura dos testes

Os testes estão organizados no diretório `tests/`. Cada arquivo representa um conjunto de casos de teste. Por exemplo:

- `github.test.js`: Testa funcionalidades relacionadas ao login e interações com o GitHub.

### Logs de erro
Os erros encontrados durante os testes serão exibidos no console para facilitar o debug.

## Dicas de Uso

- Sempre atualize as dependências para manter o projeto compatível com as versões mais recentes:
  ```bash
  npm update
  ```

- Use o modo `headless: false` no Puppeteer para visualizar as ações durante os testes.

---

Se precisar de suporte ou encontrar problemas, entre em contato com o autor:
**Daniel Licnerski**.

