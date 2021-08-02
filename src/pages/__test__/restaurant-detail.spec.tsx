import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import {
  RestaurantDetail,
  RESTAURANT_QUERY,
} from "../client/restaurant-detail";
import { BrowserRouter as Router } from "react-router-dom";

const mockedRestaurantQuery = {
  request: {
    query: RESTAURANT_QUERY,
    variables: {
      input: {
        restaurantId: 1,
      },
    },
  },
  result: {
    data: {
      restaurant: {
        ok: true,
        error: null,
        restaurant: {
          __typename: "Restaurant",
          id: 1,
          name: "test restaurant",
          coverImg: "test image",
          category: {
            name: "test category",
            slug: "test-category",
          },
          address: "test address",
          isPromoted: false,
        },
        menu: {
          __typename: "Dish",
          id: 1,
          name: "test menu",
          price: 100,
          photo: "test menu photo",
          description: "test desc",
          options: {
            name: "test option name",
            choices: {
              name: "test choice name",
              extra: 10,
            },
            extra: 10,
          },
        },
      },
    },
  },
};

describe("<RestaurantDetail />", () => {
  it("render OK", async () => {
    await waitFor(async () => {
      render(
        <MockedProvider mocks={[mockedRestaurantQuery]}>
          <HelmetProvider>
            <Router>
              <RestaurantDetail />
            </Router>
          </HelmetProvider>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
