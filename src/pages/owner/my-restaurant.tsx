import { useParams, Link, useHistory } from "react-router-dom";
import { gql, useQuery, useSubscription } from "@apollo/client";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { PageTitle } from "../../components/page-title";
import { Dish } from "../../components/dish";
import { VictoryLabel, VictoryTheme } from "victory";
import { useState, useEffect } from "react";
import {
  getOrderAmount,
  getOrderAmountVariables,
} from "../../__generated__/getOrderAmount";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { Pagination } from "../../components/pagination";
import { NoOrders } from "./no-orders";
import { pendingOrders } from "../../__generated__/pendingOrders";

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${DISH_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

export const GET_ORDER_AMOUNT_QUERY = gql`
  query getOrderAmount($input: GetOrderAmountInput!) {
    getOrderAmount(input: $input) {
      error
      ok
      totalPages
      totalResults
      orders {
        ...OrderParts
      }
    }
  }
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const [page, setPage] = useState(1);
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

  const { data: subsciptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();

  useEffect(() => {
    if (subsciptionData?.pendingOrders.id) {
      history.push(`/orders/${subsciptionData.pendingOrders.id}`);
    }
  }, [subsciptionData, history]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { data: orderAmountData } = useQuery<
    getOrderAmount,
    getOrderAmountVariables
  >(GET_ORDER_AMOUNT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
        page,
      },
    },
  });

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
                <Link
                  key={dish.id}
                  to={`/restaurant/${data.myRestaurant.restaurant?.id}/edit-dish/${dish.id}`}
                >
                  <Dish
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    photo={dish.photo}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">실시간 주문 현황</h4>
          {orderAmountData?.getOrderAmount.orders?.length !== 0 ? (
            <div className="mt-10">
              <VictoryChart
                theme={VictoryTheme.material}
                height={400}
                width={window.innerWidth}
                domainPadding={50}
              >
                <VictoryLine
                  data={orderAmountData?.getOrderAmount.orders!.map(
                    (order) => ({
                      x: order.createdAt,
                      y: order.total,
                    })
                  )}
                  labels={({ datum }) => `$${datum.y}`}
                  labelComponent={
                    <VictoryLabel
                      style={{ fontSize: 20 }}
                      renderInPortal
                      dy={-20}
                    />
                  }
                  animate={{
                    duration: 500,
                  }}
                  interpolation={"linear"}
                  style={{
                    data: {
                      stroke: "#4D7C0F",
                      strokeWidth: 3,
                    },
                  }}
                />

                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 20,
                    },
                  }}
                  tickFormat={(tick) =>
                    `${new Date(tick).toLocaleDateString("ko")} \n ${new Date(
                      tick
                    ).toLocaleTimeString("ko")} `
                  }
                />
              </VictoryChart>
              <Pagination
                onNextPageClick={onNextPageClick}
                onPrevPageClick={onPrevPageClick}
                page={page}
                totalPages={orderAmountData?.getOrderAmount.totalPages!}
              />
            </div>
          ) : (
            <NoOrders id={data?.myRestaurant.restaurant?.id!} />
          )}
        </div>
      </div>
    </div>
  );
};
