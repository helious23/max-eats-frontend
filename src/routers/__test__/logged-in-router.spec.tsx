import { createMockClient } from "mock-apollo-client";
import { render } from "../../test-utils";
import { LoggedInRouter } from "../logged-in-router";
import { ApolloProvider } from "@apollo/client";
import { ME_QUERY } from "../../hooks/useMe";
import { MockedProvider } from "@apollo/client/testing";
import { waitFor } from "@testing-library/react";
import { debug } from "console";
import { UserRole } from "../../__generated__/globalTypes";

const mockedMeQuery = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: {
        id: 1,
        email: "",
        role: UserRole.Client,
        verified: false,
      },
    },
  },
};

describe("<LoggedInRouter />", () => {
  it("renders OK", async () => {
    await waitFor(async () => {
      render(
        <MockedProvider mocks={[mockedMeQuery]}>
          <LoggedInRouter />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
