import { useParams, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { url } from "inspector";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  return (
    <div>
      <div
        className="py-28 bg-gray-700 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <div className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </div>
        <Link
          to={""}
          className="bg-gray-800 text-white py-3 px-10 mr-10 hover:text-lime-500 hover:opacity-80"
        >
          메뉴 추가하기
        </Link>
        <Link
          to={""}
          className="bg-lime-500 text-gray-700 py-3 px-10 mr-10 hover:text-white hover:opacity-80"
        >
          프로모션 구매
        </Link>
      </div>
    </div>
  );
};
