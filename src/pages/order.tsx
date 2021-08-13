import { Link, useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../fragment";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import { PageTitle } from "../components/page-title";
import { useMe } from "../hooks/useMe";
import { editOrder, editOrderVariables } from "../__generated__/editOrder";
import { OrderStatus, UserRole } from "../__generated__/globalTypes";
import { useEffect } from "react";
import { orderUpdates } from "../__generated__/orderUpdates";

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

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER
  );
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION, // 어떤 subscription 인지
        variables: {
          input: {
            id: +id,
          },
        },
        updateQuery: (
          prev, // 기존 query 에서 받아오는 data
          {
            subscriptionData: { data }, // subscription 으로 받아오는 data
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev; // subscroption data 가 없으면 기존 data return
          return {
            // query 의 data 구조와 동일하게 만들어야됨
            getOrder: {
              ...prev.getOrder, // ok, error
              order: {
                ...data.orderUpdates, // subscription 으로 바뀌는 data
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +id,
          status: newStatus,
        },
      },
    });
  };

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
            <div className="flex flex-col justify-center items-center w-full">
              {userData?.me.role === UserRole.Client && (
                <div className="text-lime-600 font-medium">
                  현재 상태 : {data?.getOrder.order?.status}
                </div>
              )}
              {userData?.me.role === UserRole.Owner && (
                <div className="w-full mx-3 flex items-center justify-center">
                  {data?.getOrder.order?.status === OrderStatus.Pending && (
                    <button
                      onClick={() => onButtonClick(OrderStatus.Cooking)}
                      className="btn w-full mx-3"
                    >
                      주문 수락 하기
                    </button>
                  )}
                  {data?.getOrder.order?.status === OrderStatus.Cooking && (
                    <button
                      onClick={() => onButtonClick(OrderStatus.Cooked)}
                      className="btn w-full mx-3"
                    >
                      배달 준비 완료
                    </button>
                  )}
                  {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                    data?.getOrder.order?.status !== OrderStatus.Pending && (
                      <div className="text-lime-600 font-medium">
                        현재 상태 : {data?.getOrder.order?.status}
                      </div>
                    )}
                </div>
              )}
              {userData?.me.role === UserRole.Delivery && (
                <div className="w-full mx-3 flex items-center justify-center">
                  {data?.getOrder.order?.status === OrderStatus.Cooked && (
                    <button
                      onClick={() => onButtonClick(OrderStatus.PickedUp)}
                      className="btn w-full mx-3"
                    >
                      주문 픽업 완료
                    </button>
                  )}
                  {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                    <button
                      onClick={() => onButtonClick(OrderStatus.Delivered)}
                      className="btn w-full mx-3"
                    >
                      배달 완료
                    </button>
                  )}
                </div>
              )}
              {data?.getOrder.order?.status === OrderStatus.Delivered && (
                <div className="text-lime-600 font-medium mt-2">
                  Max Eats를 이용해 주셔서 감사합니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
