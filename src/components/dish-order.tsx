import { restaurant_restaurant_restaurant_menu } from "../__generated__/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface IDishProps {
  dish: restaurant_restaurant_restaurant_menu;
  onDishUnclick: () => void;
}

export const DishOrder: React.FC<IDishProps> = ({ dish, onDishUnclick }) => {
  const [orderAmount, setOrderAmount] = useState(1);

  const onOrderPlus = () => {
    setOrderAmount((current) => current + 1);
  };
  const onOrderMinus = () => {
    setOrderAmount((current) => current - 1);
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
              onClick={onDishUnclick}
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
                      <div className="ml-6 text-lg font-semibold">
                        {option.name}
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
                          <div className="ml-10 mt-1">{choice.name}</div>
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
                <div className="col-span-2 lg:col-span-1 flex justify-between items-center">
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
                <div className="col-span-2 lg:col-span-3 flex justify-center bg-lime-500 mx-3 ml-10 lg:mx-10 py-3 cursor-pointer">
                  <div>{orderAmount} 개 주문하기</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
