import { PageTitle } from "../../components/page-title";
import { gql, useQuery } from "@apollo/client";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants: React.FC = () => {
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div>
      <PageTitle title={"온라인으로 음식을 주문하세요"} />
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          className="input w-4/12 rounded-md border-0"
          type="search"
          placeholder="식당을 검색하세요..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-xl mx-auto">
            {data?.allCategories.categories?.map((catetory) => (
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full bg-cover hover:bg-gray-100 cursor-pointer"
                  style={{ backgroundImage: `url(${catetory.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium cursor-pointer">
                  {catetory.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
