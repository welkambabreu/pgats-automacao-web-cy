// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ---- Comandos do Automation Exercise ----

Cypress.Commands.add('cadastrarUsuario', (usuario) => {
  cy.visit('/')
  cy.get('img[alt="Website for automation practice"]').should('be.visible')

  cy.get('a[href="/login"]').click()
  cy.contains('New User Signup!').should('be.visible')

  cy.get('[data-qa="signup-name"]').type(usuario.nome)
  cy.get('[data-qa="signup-email"]').type(usuario.email)
  cy.get('[data-qa="signup-button"]').click()

  cy.contains('Enter Account Information').should('be.visible')
  cy.get('#id_gender1').check()
  cy.get('[data-qa="password"]').type(usuario.senha, { log: false })
  cy.get('[data-qa="days"]').select('10')
  cy.get('[data-qa="months"]').select('May')
  cy.get('[data-qa="years"]').select('1990')
  cy.get('#newsletter').check()
  cy.get('#optin').check()
  cy.get('[data-qa="first_name"]').type(usuario.primeiroNome)
  cy.get('[data-qa="last_name"]').type(usuario.sobrenome)
  cy.get('[data-qa="company"]').type(usuario.empresa)
  cy.get('[data-qa="address"]').type(usuario.endereco)
  cy.get('[data-qa="address2"]').type(usuario.endereco2)
  cy.get('[data-qa="country"]').select(usuario.pais)
  cy.get('[data-qa="state"]').type(usuario.estado)
  cy.get('[data-qa="city"]').type(usuario.cidade)
  cy.get('[data-qa="zipcode"]').type(usuario.cep)
  cy.get('[data-qa="mobile_number"]').type(usuario.celular)
  cy.get('[data-qa="create-account"]').click()

  cy.contains('Account Created!').should('be.visible')
  cy.get('[data-qa="continue-button"]').click()
  cy.contains(`Logged in as ${usuario.nome}`).should('be.visible')
})

Cypress.Commands.add('efetuarLogin', (usuario) => {
  cy.contains('Login to your account').should('be.visible')
  cy.get('[data-qa="login-email"]').type(usuario.email)
  cy.get('[data-qa="login-password"]').type(usuario.senha, { log: false })
  cy.get('[data-qa="login-button"]').click()
  cy.contains(`Logged in as ${usuario.nome}`).should('be.visible')
})

Cypress.Commands.add('excluirConta', () => {
  cy.get('a[href="/delete_account"]').click()
  cy.contains('Account Deleted!').should('be.visible')
  cy.get('[data-qa="continue-button"]').click()
})

Cypress.Commands.add('adicionarProdutoAoCarrinho', (id) => {
  cy.get(`.features_items a.add-to-cart[data-product-id="${id}"]`).first().click()
  cy.get('#cartModal').should('be.visible')
  cy.get('#cartModal button.close-modal').click()
})

Cypress.Commands.add('finalizarCompra', (usuario) => {
  cy.get('a[href="/view_cart"]').first().click()
  cy.url().should('include', '/view_cart')
  cy.get('#cart_info_table').should('be.visible')

  cy.contains('Proceed To Checkout').click()

  cy.get('#address_delivery').should('contain', usuario.endereco)
    .and('contain', usuario.cidade)
  cy.get('#address_invoice').should('contain', usuario.endereco)
  cy.get('#cart_info').should('be.visible')

  cy.get('textarea[name="message"]').type('Pedido de teste automatizado')
  cy.contains('Place Order').click()

  cy.get('[data-qa="name-on-card"]').type(usuario.nome)
  cy.get('[data-qa="card-number"]').type('4111111111111111')
  cy.get('[data-qa="cvc"]').type('123')
  cy.get('[data-qa="expiry-month"]').type('12')
  cy.get('[data-qa="expiry-year"]').type('2030')
  cy.get('[data-qa="pay-button"]').click()

  cy.get('[data-qa="order-placed"]').should('be.visible')
  cy.contains('Congratulations! Your order has been confirmed!').should('be.visible')
})
