import { render, waitFor } from "../../test-utils";
import { NotFound } from "../404";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe("페이지를 찾을 수 없습니다 | Max Eats");
    });
  });
});
