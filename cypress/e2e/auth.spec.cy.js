const authUser = require('../fixtures/authUser.json')
const url = Cypress.env('url')
const { email, password, invalidPassword } = authUser
const nonExistentEmail = 'noexist@noexist.com'
const nonExistentPassword = 'noexist'

describe('Authentication Suite', () => {
  describe('Registration', () => {
    it('should allow a new user to register', () => {
      cy.visit(`${url}/signup`)
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(password)
      cy.get('form').findByLabelText('Confirm your password').type(password)
      cy.findByRole('button', { name: 'Sign-up' }).click()
      cy.contains(email, { timeout: 5000 }).should('be.visible')
      cy.deleteUser(email, password)
    })

    it('should reject registration with invalid password', () => {
      cy.visit(`${url}/signup`)
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(invalidPassword)
      cy.get('form').findByLabelText('Confirm your password').type(invalidPassword)
      cy.findByRole('button', { name: 'Sign-up' }).click()
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })

    it('should reject registration when passwords do not match', () => {
      cy.visit(`${url}/signup`)
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(password)
      cy.get('form').findByLabelText('Confirm your password').type(invalidPassword)
      cy.findByRole('button', { name: 'Sign-up' }).click()
      cy.contains('Different passwords').should('be.visible')
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      cy.signup(email, password)
      cy.logout()
      cy.visit(`${url}/signin`)
    })

    afterEach(() => {
      cy.deleteUser(email, password)
    })

    it('should allow a registered user to login', () => {
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(password)
      cy.findByTestId('sign-in-button').click()
      cy.contains(email, { timeout: 5000 }).should('be.visible')
    })

    it('should reject login with incorrect password', () => {
      cy.get('form').findByLabelText(/e-mail/i).type(email)
      cy.get('form').findByLabelText('Password').type(invalidPassword)
      cy.findByTestId('sign-in-button').click()
      cy.contains('Incorrect password').should('be.visible')
    })

    it('should reject login with unregistered email', () => {
      cy.get('form').findByLabelText(/e-mail/i).type(nonExistentEmail)
      cy.get('form').findByLabelText('Password').type(nonExistentPassword)
      cy.findByTestId('sign-in-button').click()
      cy.contains('Incorrect username or password').should('be.visible')
    })
  })
})
