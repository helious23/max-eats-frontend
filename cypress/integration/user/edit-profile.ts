describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("jenny@gmail.com", "121212");
  });

  it("can go to /edit-profile using the header", () => {
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
    user.visit("/edit-profile");
    user.findByPlaceholderText("이메일").clear().type("new@email.com");
    user.get(".text-white").click();
  });
});
