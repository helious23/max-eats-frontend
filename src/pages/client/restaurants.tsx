import { PageTitle } from "../../components/page-title";
import { gql, useQuery } from "@apollo/client";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Categories } from "../../components/categories";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div>
      <PageTitle title={"온라인으로 음식을 주문하세요"} />
      <form className="bg-gray-800 w-full py-32 flex items-center justify-center">
        <input
          className="input w-6/12 rounded-md border-0"
          type="search"
          placeholder="식당을 검색하세요..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 pb-20">
          <div className="flex justify-around max-w-xl mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Categories category={category} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10 my-16">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant restaurant={restaurant} />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center justify-center mx-auto mt-10">
            {page > 1 ? (
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="focus:outline-none text-xl cursor-pointer"
                  onClick={onPrevPageClick}
                />
              </div>
            ) : (
              <div></div>
            )}
            <span className="flex justify-center">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="focus:outline-none text-xl cursor-pointer"
                  onClick={onNextPageClick}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
