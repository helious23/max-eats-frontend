import { restaurant_restaurant_restaurant_menu } from "../__generated__/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { CreateOrderItemInput } from "../__generated__/globalTypes";
import { DishOption } from "./dish-option";
import { useHistory } from "react-router-dom";
import {
  createOrder,
  createOrderVariables,
} from "../__generated__/createOrder";

interface IDishProps {
  dish: restaurant_restaurant_restaurant_menu;
  restaurantId: string;
  onDishUnclick: () => void;
}

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      orderId
      error
    }
  }
`;

export const DishOrder: React.FC<IDishProps> = ({
  dish,
  onDishUnclick,
  restaurantId,
}) => {
  const histtory = useHistory();
  const [orderAmount, setOrderAmount] = useState(1);
  const [orderPrice, setOrderPrice] = useState(dish.price);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      alert("주문 완료 되었습니다");
      histtory.push(`/orders/${orderId}`);
    }
  };

  const [createOrderMutation, { loading }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    setOrderItems([{ dishId: dish.id, options: [] }]);
  }, [dish.id]);

  const onOrderSubmit = () => {
    if (loading) {
      alert("주문이 진행 중입니다");
      return;
    }
    const ok = window.confirm("주문을 하시겠습니까?");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            resturantId: +restaurantId,
            items: orderItems,
          },
        },
      });
    }
  };

  const onClose = () => {
    onDishUnclick();
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId: dishId,
            options: [{ name: optionName }, ...oldItem.options!],
          },
          ...current,
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId: dish.id,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ]);
    }
  };

  const addChoiceToItem = (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => {
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.choice === choiceName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId: dishId,
            options: [
              { name: optionName, choice: choiceName },
              ...oldItem.options!,
            ],
          },
          ...current,
        ]);
      }
    }
  };

  const removeChoiceFromItem = (dishId: number, choiceName: string) => {
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId: dishId,
          options: oldItem.options?.filter(
            (option) => option.choice !== choiceName
          ),
        },
        ...current,
      ]);
    }
  };

  const onOrderPlus = () => {
    setOrderAmount((current) => current + 1);
    setOrderPrice((current) => current + dish.price);
  };
  const onOrderMinus = () => {
    setOrderAmount((current) => current - 1);
    setOrderPrice((current) => current - dish.price);
  };

  const onOrderZero = () => {
    setOrderAmount((current) => current);
  };

  return (
    <div className="w-full h-full z-10 fixed top-0 left-0 backdrop-filter backdrop-brightness-50">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white w-5/6 h-5/6 lg:w-4/6 lg:h-4/6 lg:absolute grid grid-row-2 lg:grid-cols-2 lg:mb-32 overflow-auto">
          <div className="h-full">
            <div
              className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex justify-center items-center text-xl fixed m-2 lg:absolute lg:top-2 lg:left-2 cursor-pointer"
              onClick={onClose}
            >
              <span className="text-gray-700 text-sm lg:text-xl">
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            {dish.photo ? (
              <div className="h-full">
                <img
                  src={dish.photo!}
                  alt={dish.name}
                  className="h-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : null}
          </div>

          <div className="lg:overflow-auto flex flex-col justify-between">
            <div>
              <div className="flex flex-col mx-6 mt-10">
                <div className="text-4xl mb-5">{dish.name}</div>
                <div className="font-light text-sm text-gray-500 mb-5">
                  {dish.description}
                </div>
              </div>
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  option={option}
                  orderItems={orderItems}
                  addOptionToItem={addOptionToItem}
                  addChoiceToItem={addChoiceToItem}
                  isOptionSelected={isOptionSelected(dish.id, option.name)}
                  removeOptionFromItem={removeOptionFromItem}
                  removeChoiceFromItem={removeChoiceFromItem}
                  setOrderPrice={setOrderPrice}
                />
              ))}
            </div>
            <div className="w-full border-t border-gray-200">
              <div className=" mx-6 mt-5 mb-5 grid grid-cols-4 items-center">
                <div className="col-span-1 lg:col-span-1 flex justify-between items-center">
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex justify-center items-center text-xl cursor-pointer"
                    onClick={orderAmount > 1 ? onOrderMinus : onOrderZero}
                  >
                    <span className="text-gray-700 text-sm lg:text-xl">
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                  </div>
                  <div>{orderAmount}</div>
                  <div
                    className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex justify-center items-center text-xl cursor-pointer"
                    onClick={onOrderPlus}
                  >
                    <span className="text-gray-700 text-sm lg:text-xl">
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </div>
                </div>
                <div className="col-start-2 col-span-3 md:col-start-3 md:col-span-2 lg:col-span-3 flex justify-center mx-3 ml-10 lg:mx-10 py-3 cursor-pointer btn min:w-full">
                  <button className="grid grid-cols-3 w-full">
                    <div
                      className="col-span-2 text-center"
                      onClick={onOrderSubmit}
                    >
                      {orderAmount} 개 주문하기{" "}
                    </div>
                    <div className="text-center">$ {orderPrice}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
