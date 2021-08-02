import { createMockClient } from "mock-apollo-client";
import { render } from "../../test-utils";
import { LoggedOutRouter } from "../logged-out-router";
import { ApolloProvider } from "@apollo/client";

describe("<LoggedOutRouter />", () => {
  it("renders OK", () => {
    const mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <LoggedOutRouter />
      </ApolloProvider>
    );
  });
});
