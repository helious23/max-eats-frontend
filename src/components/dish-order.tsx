import {
  restaurant_restaurant_restaurant_menu,
  restaurant_restaurant_restaurant_menu_options_choices,
} from "../__generated__/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from "../__generated__/globalTypes";

interface IDishProps {
  dish: restaurant_restaurant_restaurant_menu;
  onDishUnclick: () => void;
}

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

type IChoiceForm = { key: string; value: string };

export const DishOrder: React.FC<IDishProps> = ({ dish, onDishUnclick }) => {
  const [orderAmount, setOrderAmount] = useState(1);
  const [orderPrice, setOrderPrice] = useState(dish.price);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const { register, handleSubmit, getValues } = useForm({
    mode: "onChange",
  });

  const onClose = () => {
    removeFromOrder(dish.id);
    onDishUnclick();
  };

  useEffect(() => {
    setOrderItems([{ dishId: dish.id, options: [] }]);
  }, [dish.id]);

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (option: any) => {
    const oldItem = getItem(dish.id);
    removeFromOrder(dish.id);
    if (oldItem) {
      setOrderItems((current) => [
        { dishId: dish.id, options: [option, ...oldItem.options!] },
        ...current,
      ]);
    }
  };

  const onSubmit = () => {
    // const allOptionValue = Object.values(data);
    // const selected = allOptionValue.filter(Boolean);
    // const oldItem = getItem(dish.id);
    // selected.map((option) =>
    //   setOrderOptions((current) => [{ name: option }, ...current])
    // );
    // removeFromOrder(dish.id);
    // setOrderItems((current) => [
    //   { dishId: dish.id, options: [...orderOptions] },
    //   ...current,
    // ]);
    console.log(orderItems);
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
    <form
      className="w-full h-full z-10 fixed top-0 left-0 backdrop-filter backdrop-brightness-50"
      onSubmit={handleSubmit(onSubmit)}
    >
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
                <div key={index}>
                  <div className="w-full mb-10">
                    <div className="flex items-center justify-between bg-gray-100 py-4 mb-2">
                      <div className="ml-6 text-lg font-semibold flex items-center">
                        {option.choices?.length === 0 && (
                          <input
                            {...register(`${option.name}`)}
                            type="checkbox"
                            id={option.name}
                            name={option.name}
                            onClick={() =>
                              addOptionToItem({ name: option.name })
                            }
                            value={[option.name]}
                            className="mr-5"
                          />
                        )}
                        <div>{option.name}</div>
                      </div>
                      {option.extra !== 0 && (
                        <div className="mr-6 text-sm opacity-75">
                          $ {option.extra}
                        </div>
                      )}
                    </div>
                    <div className="mx-6">
                      {option.choices?.map((choice, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <input
                              {...register(`${choice.name}`)}
                              type="checkbox"
                              id={choice.name}
                              name={choice.name}
                              value={[option.name, choice.name]}
                              className="mr-5"
                            />

                            <div className=" mt-1">{choice.name}</div>
                          </div>
                          <div className="text-sm opacity-75">
                            $ {choice.extra}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                    <div className="col-span-2 text-center">
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
    </form>
  );
};
