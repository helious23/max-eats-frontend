describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("jenny@gmail.com", "121212");
  });

  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile]').click();
    user.assertTitle("프로필 수정");
  });

  it("can change email", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "editProfileMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "EditProfileOutput",
              },
            },
          });
        });
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText("이메일").clear().type("new@email.com");
    user.findByRole("button").click();
  });
});
