import { Button } from "../button";
import { render } from "@testing-library/react";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText={"Test"} />
    );
    getByText("Test");
    rerender(<Button canClick={true} loading={true} actionText={"Test"} />);
    getByText("로딩중...");
  });
  it("should display loading", () => {
    const { getByText } = render(
      <Button canClick={false} loading={true} actionText={"Test"} />
    );
    getByText("로딩중...");
  });
  it("should have canClick false class", () => {
    const { container } = render(
      // container : <div> element
      <Button canClick={false} loading={true} actionText={"Test"} />
    );
    expect(container.firstChild).toHaveClass("bg-gray-300 pointer-events-none");
    // Vanilla JS 로 element 다를 수 있음
  });
});
