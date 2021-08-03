import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  myRestaurants,
  myRestaurantsVariables,
} from "../../__generated__/myRestaurants";
import { NoRestaurants } from "./no-restaurants";
import { PageTitle } from "../../components/page-title";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants($input: MyRestaurantsInput!) {
    myRestaurants(input: $input) {
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

export const MyRestaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<myRestaurants, myRestaurantsVariables>(
    MY_RESTAURANTS_QUERY,
    {
      variables: {
        input: {
          page,
        },
      },
    }
  );
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <PageTitle title={"등록된 식당"} />
      {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
        <NoRestaurants />
      ) : (
        !loading && (
          <div className="container">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-16">
              {data?.myRestaurants.restaurants.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  coverImg={restaurant.coverImg}
                  categoryName={restaurant.category?.name}
                />
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
                Page {page} of {data?.myRestaurants.totalPages}
              </span>
              {page !== data?.myRestaurants.totalPages ? (
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
        )
      )}
    </div>
  );
};
