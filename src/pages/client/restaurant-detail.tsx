import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { MENU_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";
import { PageTitle } from "../../components/page-title";

interface IRestaurantParams {
  id: string;
}

export const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...MenuParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${MENU_FRAGMENT}
`;

export const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    }
  );

  return (
    <div>
      <PageTitle title={data?.restaurant.restaurant?.name || "Restaurant"} />
      {!loading && (
        <div>
          <div>
            <div className="relative">
              <img
                src={data?.restaurant.restaurant?.coverImg}
                alt={data?.restaurant.restaurant?.name}
                className="w-full h-64"
                style={{ objectFit: "cover" }}
              />
              <div className="w-full h-64 absolute top-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
              <h4 className="text-4xl text-white absolute top-44 pl-10">
                {data?.restaurant.restaurant?.name}
              </h4>
            </div>
          </div>
          <div className="pl-10 mt-6 pb-20">
            <div className="text-base font-light">
              <Link
                className="hover:underline"
                to={`/category/${data?.restaurant.restaurant?.category?.slug}`}
              >
                {data?.restaurant.restaurant?.category?.name}
              </Link>
            </div>
            <div className="text-base mt-2 font-light">
              {data?.restaurant.restaurant?.address}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
