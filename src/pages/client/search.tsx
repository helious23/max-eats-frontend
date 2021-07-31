import { useHistory, useLocation, Link } from "react-router-dom";
import { PageTitle } from "../../components/page-title";
import routes from "../../routes";
import { gql, useLazyQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";
import { useEffect, useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const query = location.search.split("?term=")[1];
  useEffect(() => {
    if (!query) {
      history.replace(routes.home);
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location, callQuery, query]);

  return (
    <div>
      <PageTitle title={query} />
      {!loading && (
        <div>
          <div className="ml-20">
            <div className="text-3xl mb-3">
              "<span className="text-lime-500">{query}</span>" 검색결과
            </div>
            {data?.searchRestaurant.totalResults &&
            data.searchRestaurant.totalResults > 0 ? (
              <div className="text-base">
                총{" "}
                <span className="text-lime-500">
                  {data?.searchRestaurant.totalResults}
                </span>{" "}
                개의 식당을 찾았습니다
              </div>
            ) : (
              <div className="mt-64 flex flex-col items-center justify-center">
                <h2 className="font-semibold text-2xl mb-3">
                  식당을 찾을 수 없습니다
                </h2>
                <h4 className="font-medium text-base mb-5">
                  검색하신 단어를 포함하는 식당을 찾지 못했습니다
                </h4>
                <Link
                  className="hover:underline text-lime-600"
                  to={routes.home}
                >
                  홈 화면으로 돌아가기 &rarr;
                </Link>
              </div>
            )}
          </div>
          <div className="max-w-screen-xl mx-auto mt-8 pb-20">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-16">
              {data?.searchRestaurant.restaurants?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            {data?.searchRestaurant.totalPages &&
            data.searchRestaurant.totalPages > 0 ? (
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
                  Page {page} of {data?.searchRestaurant.totalPages}
                </span>
                {page !== data?.searchRestaurant.totalPages ? (
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
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
