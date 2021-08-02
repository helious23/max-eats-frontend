describe("Log Out", () => {
  const user = cy;
  beforeEach(() => {
    user.login("jenny@gmail.com", "121212");
  });

  it("can log out", () => {
    user.findByRole("navigation").click();
    user.assertTitle("로그인");
    user.assertLoggedOut();
  });
});
