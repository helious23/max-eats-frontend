import { render, waitFor } from "@testing-library/react";
import { App } from "../app";
import { isLoggedInVar } from "../../apollo";

// app.tsx 에서는 LoggedOutRouter 와 LoggedInRouter 가 존재하는지만 확인하면 됨
// 작동 여부는 추후 login testing 에서 확인

jest.mock("../../routers/logged-out-router.tsx", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("../../routers/logged-in-router.tsx", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />); // render 함수로 App component 를 넘겨줌 from @testing-library/react
    getByText("logged-out"); // text 가 있는지 확인
  });
  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      // state 가 바뀌고 refresh 할 때 까지 기다려줌
      isLoggedInVar(true); // 실제 로그인 하지 않고 react variable 만 변경
    });
    getByText("logged-in");
  });
});
