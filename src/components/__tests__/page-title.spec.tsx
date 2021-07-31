import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { PageTitle } from "../page-title";

describe("<PageTitle />", () => {
  it("render OK with props", async () => {
    render(
      <HelmetProvider>
        <PageTitle title={"Test Title"} />
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Test Title | Max Eats");
    });
  });
});
