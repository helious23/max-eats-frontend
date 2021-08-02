import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Category, CATEGORY_QUERY } from "../client/category";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router-dom", () => {
  // react-router-dom 을 mock
  const realModule = jest.requireActual("react-router-dom"); // useHistory 를 제외한 다른 fn 은 그대로 들고옴
  return {
    ...realModule,
    useParams: () => {
      // useHistory 만 mocking
      return {
        slug: "test-category",
      };
    },
  };
});

const mockedCategoryQuery = {
  request: {
    query: CATEGORY_QUERY,
    variables: {
      input: {
        page: 1,
        slug: "test-category",
      },
    },
  },
  result: {
    data: {
      category: {
        ok: true,
        error: null,
        totalPages: 2,
        totalResults: 4,
        restaurants: [
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
          {
            __typename: "Restaurant",
            id: 2,
            name: "Test Restaurant 2",
            coverImg: "Test Img",
            category: {
              name: "Test Category",
              slug: "test-category",
            },
            address: "test address",
            isPromoted: false,
          },
          {
            __typename: "Restaurant",
            id: 3,
            name: "Test Restaurant 3",
            coverImg: "Test Img",
            category: {
              name: "Test Category",
              slug: "test-category",
            },
            address: "test address",
            isPromoted: false,
          },
          {
            __typename: "Restaurant",
            id: 4,
            name: "Test Restaurant 4",
            coverImg: "Test Img",
            category: {
              name: "Test Category",
              slug: "test-category",
            },
            address: "test address",
            isPromoted: false,
          },
        ],
        category: {
          __typename: "Category",
          id: 1,
          name: "Test Category",
          coverImg: "test category image",
          slug: "test-category-2",
          restaurantCount: 1,
        },

        loading: false,
      },
    },
  },
};

describe("<Category />", () => {
  let renderResults: RenderResult;
  beforeEach(async () => {
    await waitFor(async () => {
      renderResults = render(
        <HelmetProvider>
          <MockedProvider
            mocks={[
              // useMe 의 ME_QUERY result 를 mock
              mockedCategoryQuery,
            ]}
          >
            <Router>
              <Category />
            </Router>
          </MockedProvider>
        </HelmetProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it("render OK", () => {
    const { getByText, debug, container } = renderResults;
    getByText("Test Restaurant 1");
    getByText("Test Restaurant 2");
    const link = container.firstChild?.firstChild?.firstChild as HTMLElement;
    expect(link).toHaveAttribute("href", `/category/test-category-2`);
  });
  it("should change page", () => {
    const { debug } = renderResults;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
