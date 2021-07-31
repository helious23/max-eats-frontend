import {
  getByPlaceholderText,
  getByRole,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { Login } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResults: RenderResult; // test 에서 render 에 접근하기 위해 변수 생성
  let errorMessage: HTMLElement;
  beforeEach(async () => {
    // test 마다 render 시키기 위해 beforeEach 사용
    await waitFor(() => {
      const mockedClient = createMockClient(); // client 를 mock
      renderResults = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
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
    const { debug, getByPlaceholderText, getByRole } = renderResults;
    const password = getByPlaceholderText("패스워드");
    await waitFor(() => {
      userEvent.type(password, "1");
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("패스워드가 필요합니다");
  });
});
