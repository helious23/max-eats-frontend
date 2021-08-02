import routes from "../../src/routes";
describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit(routes.home).title().should("eq", "로그인 | Max Eats");
  });
  it("can see email / password validation error", () => {
    user.visit(routes.home);
    user.findByPlaceholderText("이메일").type("bad@email");
    user
      .findByRole("alert")
      .should("have.text", "유효한 이메일 주소가 아닙니다");
    user.findByPlaceholderText("이메일").clear();
    user.findByRole("alert").should("have.text", "이메일 주소가 필요합니다");
    user.findByPlaceholderText("이메일").type("jenny@gmail.com");
    user.findByPlaceholderText("패스워드").type("something").clear();
    user.findByRole("alert").should("have.text", "패스워드가 필요합니다");
  });
  it("can fill out the form", () => {
    user.visit(routes.home);
    user.findByPlaceholderText("이메일").type("jenny@gmail.com");
    user.findByPlaceholderText("패스워드").type("121212");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.maxeats-token").should("be.a", "string");
  });
});
