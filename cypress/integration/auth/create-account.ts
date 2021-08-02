import routes from "../../../src/routes";

describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit(routes.home);
    user.findByText("계정 만들기").click();
    user.assertTitle("회원 가입");
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
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    user.visit(routes.createAccount);
    user.findByPlaceholderText("이메일").type("jenny@gmail.com");
    user.findByPlaceholderText("패스워드").type("121212");
    user.findByRole("button").click();
    user.wait(3000);
    user.assertTitle("로그인");
    user
      .findByRole("status")
      .should("have.text", "계정이 생성되었습니다. 로그인 하세요.");

    user.findByRole("button").click();
    user.assertLoggedIn();
  });
});
