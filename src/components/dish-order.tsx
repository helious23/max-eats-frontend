import { restaurant_restaurant_restaurant_menu } from "../__generated__/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface IDishProps {
  dish: restaurant_restaurant_restaurant_menu;
  onDishUnclick: () => void;
}

export const DishOrder: React.FC<IDishProps> = ({ dish, onDishUnclick }) => {
  return (
    <div className="w-full h-full z-10 fixed top-0 left-0 backdrop-filter backdrop-brightness-50">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white w-4/6 h-4/6 absolute grid grid-row-2 lg:grid-cols-2 mb-32">
          <div className="h-full">
            <div
              className="w-5 h-5 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex justify-center items-center text-xl absolute top-2 left-2 cursor-pointer"
              onClick={onDishUnclick}
            >
              <span className="text-gray-700 text-sm lg:text-xl">
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <div className="h-full">
              <img
                src={dish.photo!}
                alt={dish.name}
                className="h-full"
                style={{ objectFit: "fill" }}
              />
            </div>
          </div>
          <div className="overflow-auto">
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
                    <div className="ml-6">{option.name}</div>
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
        </div>
      </div>
    </div>
  );
};
