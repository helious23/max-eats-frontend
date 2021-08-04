import { useParams, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { PageTitle } from "../../components/page-title";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${DISH_FRAGMENT}
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
  console.log(data);
  return (
    <div>
      <PageTitle title={data?.myRestaurant.restaurant?.name || "나의 식당"} />
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
          to={`/restaurant/${data?.myRestaurant.restaurant?.id}/add-dish`}
          className="bg-gray-800 text-white py-3 px-10 mr-10 hover:text-lime-500 hover:opacity-80"
        >
          메뉴 추가하기 &rarr;
        </Link>
        <Link
          to={""}
          className="bg-lime-500 text-gray-700 py-3 px-10 mr-10 hover:text-white hover:opacity-80 font-bold"
        >
          프로모션 구매 &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <div>
              <h2 className="font-semibold text-2xl mb-3">
                등록된 메뉴가 없습니다.
              </h2>
              <h4 className="font-medium text-base mb-5">
                식당의 메뉴를 등록하세요!
              </h4>
            </div>
          ) : (
            {}
          )}
        </div>
      </div>
    </div>
  );
};
