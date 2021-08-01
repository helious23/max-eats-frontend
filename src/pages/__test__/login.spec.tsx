import { Login, LOGIN_MUTATION } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";
import { render, waitFor, RenderResult } from "../../test-utils";

describe("<Login />", () => {
  let renderResults: RenderResult; // test 에서 render 에 접근하기 위해 변수 생성
  let errorMessage: HTMLElement;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    // test 마다 render 시키기 위해 beforeEach 사용
    await waitFor(() => {
      mockedClient = createMockClient(); // client 를 mock
      renderResults = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("로그인 | Max Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResults;
    const email = getByPlaceholderText("이메일"); // placeholder 를 "이메일" 로 가지고 있는 html element 리턴
    await waitFor(() => {
      userEvent.type(email, "not-validt@email"); // email 에 유효하지 않은 이메일을 type(입력)
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("유효한 이메일 주소가 아닙니다");
    await waitFor(() => {
      userEvent.clear(email); // email element 의 내용을 clear
    });
    expect(errorMessage).toHaveTextContent("이메일 주소가 필요합니다");
  });

  it("displays password validation errors", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResults;
    const email = getByPlaceholderText("이메일");
    const submitBtn = getByRole("button");

    await waitFor(() => {
      userEvent.type(email, "fake@email.com");
      userEvent.click(submitBtn);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("패스워드가 필요합니다");
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResults;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("패스워드");
    const submitBtn = getByRole("button");

    const formData = {
      email: "real@test.com",
      password: "1234",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "xxx",
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    jest.spyOn(Storage.prototype, "setItem");

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("mutation-error");
    expect(localStorage.setItem).toHaveBeenCalledWith("maxeats-token", "xxx");
  });
});
