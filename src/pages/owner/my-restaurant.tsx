import { useParams, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { PageTitle } from "../../components/page-title";
import { Dish } from "../../components/dish";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";

export const MY_RESTAURANT_QUERY = gql`
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

  return (
    <div>
      <PageTitle title={data?.myRestaurant.restaurant?.name || "나의 식당"} />
      <div
        className="py-28 bg-gray-700 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="max-w-screen-2xl mx-auto pb-20 mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
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
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-16">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  photo={dish.photo}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="max-w-lg w-full mx-auto">
            <VictoryChart domainPadding={20}>
              <VictoryAxis
                label="주문 금액"
                dependentAxis
                tickValues={[20, 30, 40, 50, 60, 70, 80, 90, 100]}
              />
              <VictoryAxis label="일별" />
              <VictoryBar
                data={[
                  { x: 10, y: 20 },
                  { x: 20, y: 15 },
                  { x: 30, y: 55 },
                  { x: 40, y: 99 },
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
