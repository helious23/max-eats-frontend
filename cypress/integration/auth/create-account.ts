import routes from "../../../src/routes";

describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit(routes.home);
    user.findByText("계정 만들기").click();
    user.findByPlaceholderText("이메일").type("bad@email");
    user
      .findByRole("alert")
      .should("have.text", "유효한 이메일 주소가 아닙니다");
    user.findByPlaceholderText("이메일").clear();
    user.findByRole("alert").should("have.text", "이메일 주소가 필요합니다");
    user.findByPlaceholderText("이메일").type("jenny@gmail.com");
    user.findByPlaceholderText("패스워드").type("something").clear();
    user.findByRole("alert").should("have.text", "패스워드가 필요합니다");
    user.findByPlaceholderText("패스워드").type("121212");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.findByRole("alert").should("have.text", "사용중인 이메일 입니다");
  });
  it("should can create account and login", () => {
    user.visit(routes.createAccount);
    user.findByPlaceholderText("이메일").type("max@gmail.com");
    user.findByPlaceholderText("패스워드").type("121212");
    user.findByRole("button").click();
    user.wait(5000);
    user
      .findByRole("alert")
      .should("have.text", "계정이 생성되었습니다. 로그인 하세요.");
    user.findByRole("button").click();
    user.window().its("localStorage.maxeats-token").should("be.a", "string");
  });
});
