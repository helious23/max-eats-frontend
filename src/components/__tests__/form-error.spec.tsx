import { FormError } from "../form-error";
import { render } from "@testing-library/react";

describe("<FormError />", () => {
  it("should render OK with props", () => {
    const { getByText } = render(<FormError errorMessage={"Test"} />);
    getByText("Test");
  });
});
