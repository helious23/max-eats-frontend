import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { Header } from "../header";
import { BrowserRouter as Router } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";
import userEvent from "@testing-library/user-event";

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

const mockedMeQuery = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: {
        id: 1,
        email: "",
        role: "",
        verified: false,
      },
    },
  },
};

describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider // apollo client 에러 때문에 MockedProvider 추가
          mocks={[
            // useMe 의 ME_QUERY result 를 mock
            mockedMeQuery,
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0)); // query 에 시간이 걸리므로 비동기 처리 (0초?;)
      getByText("이메일 인증을 진행해 주세요");
    });
  });

  it("renders without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider // apollo client 에러 때문에 MockedProvider 추가
          mocks={[
            // useMe 의 ME_QUERY result 를 mock
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0)); // query 에 시간이 걸리므로 비동기 처리 (0초?;)
      expect(queryByText("이메일 인증을 진행해 주세요")).toBeNull(); // queryByText 은 해당 항목이 없을 경우 return null
    });
  });

  it("should log out", async () => {
    const { debug, getByRole } = render(
      <MockedProvider mocks={[mockedMeQuery]}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    const btn = getByRole("navigation");
    await waitFor(() => {
      userEvent.click(btn);
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
