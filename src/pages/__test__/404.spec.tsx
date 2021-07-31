import { render, waitFor } from "@testing-library/react";
import { NotFound } from "../404";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("페이지를 찾을 수 없습니다 | Max Eats");
    });
  });
});
