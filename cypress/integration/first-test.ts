import routes from "../../src/routes";
describe("Log In", () => {
  it("should see login page", () => {
    cy.visit(routes.home).title().should("eq", "로그인 | Max Eats");
  });
  it("can fill out the form", () => {
    cy.visit(routes.home)
      .get('[name="email"]')
      .type("jenny@gmail.com")
      .get('[name="password"]')
      .type("12345")
      .get(".grid > .text-white")
      .should("not.have.class", "pointer-events-none");
  });
});
