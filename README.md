# PGATS – Automação Web com Cypress

Testes end-to-end do site [Automation Exercise](https://automationexercise.com) usando **Cypress**, **Mocha** e **JavaScript**.

## Casos de teste implementados

Baseados em https://automationexercise.com/test_cases:

| # | Cenário |
|---|---------|
| 1 | Cadastrar usuário |
| 2 | Login com e-mail e senha corretos |
| 3 | Login com e-mail e senha incorretos |
| 4 | Logout de usuário |
| 5 | Cadastro com e-mail já existente |
| 8 | Verificar todos os produtos e a página de detalhes |
| 9 | Pesquisar produto |
| 10 | Verificar inscrição (subscription) na página inicial |
| 15 | Fazer pedido – cadastrar antes do checkout |
| 16 | Fazer pedido – login antes do checkout |

Os testes estão em [`cypress/e2e/automation-exercise.cy.js`](cypress/e2e/automation-exercise.cy.js). Cada execução gera usuários com e-mail único (baseado em timestamp) e exclui as contas criadas ao final.

## Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS)
- Navegador Chrome, Edge ou Electron (já incluso no Cypress)

## Instalação

```bash
npm install
```

## Execução

Modo interativo (interface do Cypress):

```bash
npx cypress open
```

Modo headless (terminal):

```bash
npx cypress run --spec cypress/e2e/automation-exercise.cy.js
```

Visualizando no navegador:

```bash
npx cypress run --headed --browser chrome --spec cypress/e2e/automation-exercise.cy.js
```

Para rodar um único cenário, use `it.only(...)` no teste desejado.

## Estrutura

```text
cypress/
  e2e/automation-exercise.cy.js   # cenários automatizados
  support/                        # comandos e configurações globais
cypress.config.js                 # baseUrl e timeouts
```

> A pasta `cypress/e2e/1-getting-started` e `2-advanced-examples` contém apenas exemplos padrão do Cypress.

## Observações

- A execução completa leva alguns minutos, pois vários cenários criam e excluem contas.
- O site é público e pode ficar lento ou exibir anúncios, o que eventualmente causa falhas intermitentes.
