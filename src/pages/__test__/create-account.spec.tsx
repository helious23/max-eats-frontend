import { CreateAccount } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ApolloProvider } from "@apollo/client";
import { render, waitFor, RenderResult } from "../../test-utils";
import userEvent from "@testing-library/user-event";

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let errorMessage: HTMLElement;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("회원 가입 | Max Eats");
    });
  });

  it("displays email validation error", async () => {
    const { debug, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    await waitFor(() => {
      userEvent.type(email, "not@vaild");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("유효한 이메일 주소가 아닙니다");
  });
});
