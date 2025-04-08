const heuristic = require('../fixtures/heuristic.json')
const authUser = require('../fixtures/authUser.json')

const url = Cypress.env('url')
const { email, password } = authUser
const { name, description } = heuristic

describe('Heuristic Test Suite', () => {
  before('Signup into the app', () => {
    cy.deleteUser(email, password)
    cy.signup(email, password)
    cy.login(email, password)
  })

  after('Remove user', () => {
    cy.deleteUser(email, password)
  })

  describe('Create Heuristic Test', () => {
    it('should allow a new test to be created', () => {
      cy.visit(`${url}/testslist`)
      cy.findByTestId('create-test-btn').click()
      cy.findByText('Create a blank test').click()
      cy.findByText('Usability Heuristic').click()

      cy.findByLabelText(/Test name/i).type(name)
      cy.findByLabelText(/Test Description/i).type(description)
      cy.findByTestId('add-name-test-creation-btn').click()

      cy.contains(/Manager/i, { timeout: 5000 }).should('be.visible')
    })
  })
})
