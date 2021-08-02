import routes from "../../../src/routes";

describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("jenny@gmail.com", "121212");
  });

  it("can go to /edit-profile using the header icon", () => {
    user.get('a[href="/edit-profile"]').click();
    user.assertTitle("프로필 수정");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "editProfile") {
        //@ts-ignore
        req.body?.variables?.input?.email = "jenny@gmail.com";
        req.reply((res) => {
          res.send({
            fixture: "user/edit-profile.json",
          });
        });
      }
    });
    user.visit(routes.editProfile);
    user.findByPlaceholderText("이메일").clear().type("new@email.com");
    user.findByRole("button").click();
  });

  it("can change password", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.password = "121212";
      }
    });
    user.visit(routes.editProfile);
    user.findByPlaceholderText("이메일").clear();
    user.findAllByPlaceholderText("패스워드").type("new-password");
    user.findByRole("button").click();
  });
});
