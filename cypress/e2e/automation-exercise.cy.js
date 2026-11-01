/// <reference types="cypress" />

describe('Automation Exercise', () => {

  // Gera dados únicos a cada execução, garantindo que o cadastro
  // nunca falhe por e-mail já existente (funciona em todas as execuções)
  function gerarUsuario() {
    const timestamp = Date.now()
    return {
      nome: `Usuario Teste ${timestamp}`,
      email: `usuario.teste.${timestamp}@exemplo.com`,
      senha: 'Teste@123',
      primeiroNome: 'Usuario',
      sobrenome: 'Teste',
      empresa: 'Empresa de Testes',
      endereco: 'Rua dos Testes, 123',
      endereco2: 'Apto 101',
      pais: 'Canada',
      estado: 'Ontario',
      cidade: 'Toronto',
      cep: '12345',
      celular: '11999998888'
    }
  }

  it('Test Case 1: Cadastrar usuário', () => {
    const usuario = gerarUsuario()

    cy.cadastrarUsuario(usuario)
    cy.excluirConta()
  })

  it('Test Case 2: Login com e-mail e senha corretos', () => {
    const usuario = gerarUsuario()
    cy.cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')

    cy.efetuarLogin(usuario)
    cy.excluirConta()
  })

  it('Test Case 3: Login com e-mail e senha incorretos', () => {
    cy.visit('/')
    cy.get('img[alt="Website for automation practice"]').should('be.visible')

    cy.get('a[href="/login"]').click()
    cy.contains('Login to your account').should('be.visible')

    cy.get('[data-qa="login-email"]').type(`email.invalido.${Date.now()}@exemplo.com`)
    cy.get('[data-qa="login-password"]').type('senhaIncorreta123')
    cy.get('[data-qa="login-button"]').click()

    cy.contains('Your email or password is incorrect!').should('be.visible')
  })

  it('Test Case 4: Logout de usuário', () => {
    const usuario = gerarUsuario()
    cy.cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')

    cy.efetuarLogin(usuario)

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
    cy.contains('Login to your account').should('be.visible')

    // limpeza: remove a conta criada para o teste
    cy.efetuarLogin(usuario)
    cy.excluirConta()
  })

  it('Test Case 5: Cadastro com e-mail já existente', () => {
    const usuario = gerarUsuario()
    cy.cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.contains('New User Signup!').should('be.visible')

    cy.get('[data-qa="signup-name"]').type(usuario.nome)
    cy.get('[data-qa="signup-email"]').type(usuario.email)
    cy.get('[data-qa="signup-button"]').click()

    cy.contains('Email Address already exist!').should('be.visible')

    // limpeza: remove a conta criada para o teste
    cy.efetuarLogin(usuario)
    cy.excluirConta()
  })

  it('Test Case 8: Verificar todos os produtos e a página de detalhes', () => {
    cy.visit('/')
    cy.get('img[alt="Website for automation practice"]').should('be.visible')

    cy.get('a[href="/products"]').click()
    cy.url().should('include', '/products')
    cy.contains('All Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

    cy.get('a[href="/product_details/1"]').click()
    cy.url().should('include', '/product_details/1')

    cy.get('.product-information').within(() => {
      cy.get('h2').should('be.visible')
      cy.contains('Category:').should('be.visible')
      cy.contains('Rs.').should('be.visible')
      cy.contains('Availability:').should('be.visible')
      cy.contains('Condition:').should('be.visible')
      cy.contains('Brand:').should('be.visible')
    })
  })

  it('Test Case 9: Pesquisar produto', () => {
    const termo = 'Blue'

    cy.visit('/')
    cy.get('a[href="/products"]').click()
    cy.contains('All Products').should('be.visible')

    cy.get('#search_product').type(termo)
    cy.get('#submit_search').click()

    cy.contains('Searched Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
    cy.get('.features_items .productinfo p').each(($nome) => {
      expect($nome.text().toLowerCase()).to.contain(termo.toLowerCase())
    })
  })

  it('Test Case 10: Verificar inscrição (subscription) na página inicial', () => {
    cy.visit('/')
    cy.get('img[alt="Website for automation practice"]').should('be.visible')

    cy.get('footer').scrollIntoView()
    cy.contains('Subscription').should('be.visible')

    cy.get('#susbscribe_email').type(`inscricao.${Date.now()}@exemplo.com`)
    cy.get('#subscribe').click()

    cy.contains('You have been successfully subscribed!').should('be.visible')
  })

  it('Test Case 15: Fazer pedido - cadastrar antes do checkout', () => {
    const usuario = gerarUsuario()
    cy.cadastrarUsuario(usuario)

    cy.get('a[href="/products"]').click()
    cy.adicionarProdutoAoCarrinho(1)
    cy.adicionarProdutoAoCarrinho(2)

    cy.finalizarCompra(usuario)
    cy.excluirConta()
  })

  it('Test Case 16: Fazer pedido - login antes do checkout', () => {
    const usuario = gerarUsuario()
    cy.cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
    cy.efetuarLogin(usuario)

    cy.get('a[href="/products"]').click()
    cy.adicionarProdutoAoCarrinho(1)
    cy.adicionarProdutoAoCarrinho(2)

    cy.finalizarCompra(usuario)
    cy.excluirConta()
  })
})