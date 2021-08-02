import { MockedProvider } from "@apollo/client/testing";
import { render } from "../../test-utils";
import { Restaurants, RESTAURANTS_QUERY } from "../client/restaurants";
import { waitFor } from "@testing-library/react";

const mockedRestaurantsQuery = {
  request: {
    query: RESTAURANTS_QUERY,
    variables: {
      input: {
        page: 1,
      },
    },
  },
  result: {
    data: {
      restaurantsPageQuery: {
        allCategories: {
          ok: true,
          error: null,
          categories: [
            {
              __typename: "Category",
              id: 1,
              name: "test category",
              coverImg: "test image",
              slug: "test-category",
              restaurantCount: 1,
            },
          ],
        },
        restaurants: {
          ok: true,
          error: null,
          totalPages: 1,
          totalResults: 1,
          results: [
            {
              __typename: "Restaurant",
              id: 1,
              name: "Test Restaurant 1",
              coverImg: "Test Img",
              category: {
                name: "Test Category",
                slug: "test-category",
              },
              address: "test address",
              isPromoted: false,
            },
          ],
        },
      },
    },
    loading: false,
  },
};

describe("<Restaurants />", () => {
  it("render OK", async () => {
    await waitFor(async () => {
      const { debug } = render(
        <MockedProvider mocks={[mockedRestaurantsQuery]}>
          <Restaurants />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      debug();
    });
  });
});
