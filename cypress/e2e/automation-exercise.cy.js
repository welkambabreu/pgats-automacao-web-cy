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

  // Realiza o cadastro completo pela interface (fluxo do Test Case 1)
  // e termina com o usuário logado
  function cadastrarUsuario(usuario) {
    cy.visit('/')
    cy.get('img[alt="Website for automation practice"]').should('be.visible')

    cy.get('a[href="/login"]').click()
    cy.contains('New User Signup!').should('be.visible')

    cy.get('[data-qa="signup-name"]').type(usuario.nome)
    cy.get('[data-qa="signup-email"]').type(usuario.email)
    cy.get('[data-qa="signup-button"]').click()

    cy.contains('Enter Account Information').should('be.visible')
    cy.get('#id_gender1').check()
    cy.get('[data-qa="password"]').type(usuario.senha)
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
  }

  // Efetua login pela interface a partir da página de login
  function efetuarLogin(usuario) {
    cy.contains('Login to your account').should('be.visible')
    cy.get('[data-qa="login-email"]').type(usuario.email)
    cy.get('[data-qa="login-password"]').type(usuario.senha)
    cy.get('[data-qa="login-button"]').click()
    cy.contains(`Logged in as ${usuario.nome}`).should('be.visible')
  }

  // Exclui a conta logada (limpeza para não deixar contas órfãs no site)
  function excluirConta() {
    cy.get('a[href="/delete_account"]').click()
    cy.contains('Account Deleted!').should('be.visible')
    cy.get('[data-qa="continue-button"]').click()
  }

  it('Test Case 1: Cadastrar usuário', () => {
    const usuario = gerarUsuario()

    cadastrarUsuario(usuario)
    excluirConta()
  })

  it('Test Case 2: Login com e-mail e senha corretos', () => {
    const usuario = gerarUsuario()
    cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')

    efetuarLogin(usuario)
    excluirConta()
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
    cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')

    efetuarLogin(usuario)

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
    cy.contains('Login to your account').should('be.visible')

    // limpeza: remove a conta criada para o teste
    efetuarLogin(usuario)
    excluirConta()
  })

  it('Test Case 5: Cadastro com e-mail já existente', () => {
    const usuario = gerarUsuario()
    cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.contains('New User Signup!').should('be.visible')

    cy.get('[data-qa="signup-name"]').type(usuario.nome)
    cy.get('[data-qa="signup-email"]').type(usuario.email)
    cy.get('[data-qa="signup-button"]').click()

    cy.contains('Email Address already exist!').should('be.visible')

    // limpeza: remove a conta criada para o teste
    efetuarLogin(usuario)
    excluirConta()
  })

  // Adiciona o produto de id informado ao carrinho a partir da lista de produtos
  function adicionarProdutoAoCarrinho(id) {
    cy.get(`.features_items a.add-to-cart[data-product-id="${id}"]`).first().click()
    cy.get('#cartModal').should('be.visible')
    cy.get('#cartModal button.close-modal').click()
  }

  // Fluxo comum de checkout (Test Cases 15 e 16): do carrinho até a confirmação do pedido
  function finalizarCompra(usuario) {
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
  }

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
    cadastrarUsuario(usuario)

    cy.get('a[href="/products"]').click()
    adicionarProdutoAoCarrinho(1)
    adicionarProdutoAoCarrinho(2)

    finalizarCompra(usuario)
    excluirConta()
  })

  it('Test Case 16: Fazer pedido - login antes do checkout', () => {
    const usuario = gerarUsuario()
    cadastrarUsuario(usuario) // pré-condição: usuário cadastrado

    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
    efetuarLogin(usuario)

    cy.get('a[href="/products"]').click()
    adicionarProdutoAoCarrinho(1)
    adicionarProdutoAoCarrinho(2)

    finalizarCompra(usuario)
    excluirConta()
  })
})