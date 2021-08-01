import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ApolloProvider } from "@apollo/client";
import { render, waitFor, RenderResult } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  // react-router-dom 을 mock
  const realModule = jest.requireActual("react-router-dom"); // useHistory 를 제외한 다른 fn 은 그대로 들고옴
  return {
    ...realModule,
    useHistory: () => {
      // useHistory 만 mocking
      return {
        push: mockPush,
      };
    },
  };
});

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

  it("displays validation error", async () => {
    const { debug, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("패스워드");
    const submitBtn = getByRole("button");

    await waitFor(() => {
      userEvent.type(email, "not@vaild");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("유효한 이메일 주소가 아닙니다");

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("이메일 주소가 필요합니다");

    await waitFor(() => {
      userEvent.type(email, "test@email.com");
      userEvent.click(submitBtn);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("패스워드가 필요합니다");
  });

  it("submits mutation with form values", async () => {
    const { debug, getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("패스워드");
    const submitBtn = getByRole("button");

    const formData = {
      email: "real@test.com",
      password: "1234",
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    errorMessage = getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/", {
      email: "real@test.com",
      message: "계정이 생성되었습니다. 로그인 하세요.",
      password: "1234",
    });
    expect(errorMessage).toHaveTextContent("mutation-error");
  });

  // mocked module 을 원래대로 돌려 놓음
  afterAll(() => {
    jest.clearAllMocks();
  });
});
