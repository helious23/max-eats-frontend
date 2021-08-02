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

import "@testing-library/cypress/add-commands";
import routes from "../../src/routes";

declare global {
  namespace Cypress {
    interface Chainable {
      assertLoggedIn(): void;
      assertLoggedOut(): void;
      login(email: string, password: string): void;
    }
  }
}

Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.maxeats-token").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.maxeats-token").should("be.undefined");
});

Cypress.Commands.add("login", (email, password) => {
  cy.assertLoggedOut();
  cy.visit(routes.home);
  cy.title().should("eq", "로그인 | Max Eats");
  cy.findByPlaceholderText("이메일").type(email);
  cy.findByPlaceholderText("패스워드").type(password);
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();
  cy.assertLoggedIn();
});
