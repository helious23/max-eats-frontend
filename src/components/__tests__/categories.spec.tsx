import { render } from "@testing-library/react";
import { Categories } from "../categories";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Categories />", () => {
  it("should render OK with props", () => {
    const categoriesProps = {
      id: 1,
      name: "testName",
      coverImg: "testImg",
      slug: "test-slug",
    };
    const { getByText, container } = render(
      <Router>
        <Categories {...categoriesProps} />
      </Router>
    );
    getByText(categoriesProps.name);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/category/${categoriesProps.slug}`
    );
  });
});
