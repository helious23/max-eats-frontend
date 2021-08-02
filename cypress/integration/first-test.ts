import routes from "../../src/routes";
describe("Log In", () => {
  it("should see login page", () => {
    cy.visit(routes.home).title().should("eq", "로그인 | Max Eats");
  });
  it("can fill out the form", () => {
    cy.visit(routes.home);
    cy.findByPlaceholderText("이메일").type("jenny@gmail.com");
    cy.findByPlaceholderText("패스워드").type("12345");
    cy.findByRole("button").should("not.have.class", "pointer-events-none");
    // to do (can log in)
  });
  it("can see email / password validation error", () => {
    cy.visit(routes.home);
    cy.findByPlaceholderText("이메일").type("bad@email");
    cy.findByRole("alert").should("have.text", "유효한 이메일 주소가 아닙니다");
  });
});
