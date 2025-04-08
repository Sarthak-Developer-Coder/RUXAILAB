describe('RUXAILAB APP', () => {
  const baseUrl = 'http://localhost:8080'

  beforeEach(() => {
    cy.visit(baseUrl)
  })

  it('should visit the app', () => {
    cy.url().should('eq', `${baseUrl}/`)
  })

  it('should have the correct title text', () => {
    cy.contains('RUXAILAB').should('be.visible')
  })
})
