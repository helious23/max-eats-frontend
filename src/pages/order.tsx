import { Link, useParams } from "react-router-dom";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../fragment";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import { PageTitle } from "../components/page-title";
import { useMe } from "../hooks/useMe";
import {
  orderUpdates,
  orderUpdatesVariables,
} from "../__generated__/orderUpdates";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data: userData } = useMe();
  const { data } = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  const { data: subscriptionData } = useSubscription<
    orderUpdates,
    orderUpdatesVariables
  >(ORDER_SUBSCRIPTION, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  console.log(subscriptionData);

  return (
    <div>
      <PageTitle title={`주문 번호 #${id}`} />
      <div className="mt-32 flex flex-col items-center justify-center">
        <div className="grid grid-rows-8 w-3/4 lg:w-4/12">
          <div className="bg-gray-800 text-white text-lg py-3 text-center">
            주문 번호 #{data?.getOrder.order?.id}
          </div>
          <div className=" border-r border-l border-gray-700 text-center text-3xl row-span-2 h-24 flex items-center justify-center">
            <div>$ {data?.getOrder.order?.total}</div>
          </div>
          <div className="border-r border-l border-gray-700">
            <div className="mx-3 py-3 border-t border-gray-500 font-bold">
              <span className="ml-3">식당 이름 : </span>
              <Link
                to={`/restaurant/${data?.getOrder.order?.restaurant?.id}`}
                className="link"
              >
                {data?.getOrder.order?.restaurant?.name}
              </Link>
            </div>
          </div>
          <div className="border-r border-l border-gray-700">
            <div className="mx-3 py-3 border-t border-gray-500 font-bold">
              <span className="ml-3">
                고객 이메일 : {data?.getOrder.order?.customer?.email}
              </span>
            </div>
          </div>
          <div className="border-r border-l border-gray-700">
            <div className="mx-3 py-3 border-t border-b border-gray-500 font-bold">
              <span className="ml-3">배달원 이메일 :</span>
              <span className="ml-1">
                {data?.getOrder.order?.driver?.email === undefined
                  ? "배달원 배치 전입니다."
                  : data?.getOrder.order?.driver?.email}
              </span>
            </div>
          </div>
          <div className="border-r border-l border-gray-700 row-span-2 border-b h-24 flex items-center justify-center text-xl">
            {userData?.me.role === "Client" && (
              <div className="text-lime-600 font-medium">
                현재 상태 : {data?.getOrder.order?.status}
              </div>
            )}
            {userData?.me.role === "Owner" && (
              <div className="w-full mx-3">
                {data?.getOrder.order?.status === "Pending" && (
                  <button className="btn w-full">주문 수락 하기</button>
                )}
                {data?.getOrder.order?.status === "Cooking" && (
                  <button className="btn w-full">요리 완료</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
