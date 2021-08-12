import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";
import { CreateOrderItemInput } from "../__generated__/globalTypes";

interface IDishOptionProps {
  dishId: number;
  isOptionSelected: boolean;
  orderItems: CreateOrderItemInput[];
  option: restaurant_restaurant_restaurant_menu_options;
  addOptionToItem: (dishId: number, optionName: string) => void;
  addChoiceToItem: (
    dishId: number,
    optionName: string,
    choiceName: string
  ) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
  removeChoiceFromItem: (dishId: number, choiceName: string) => void;
  setOrderPrice: React.Dispatch<React.SetStateAction<number>>;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  option,
  orderItems,
  addOptionToItem,
  addChoiceToItem,
  isOptionSelected,
  removeOptionFromItem,
  removeChoiceFromItem,
  setOrderPrice,
}) => {
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const getChoiceFormItem = (
    item: CreateOrderItemInput,
    choiceName: string
  ) => {
    return item.options?.find((option) => option.choice === choiceName);
  };

  const isChoiceSelected = (dishId: number, choiceName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getChoiceFormItem(item, choiceName));
    }
  };

  const onOptionClick = () => {
    if (isOptionSelected) {
      removeOptionFromItem(dishId, option.name);
      if (option.extra !== null) {
        setOrderPrice((current) => current - option.extra!);
      }
    } else {
      addOptionToItem(dishId, option.name);
      if (option.extra !== null) {
        setOrderPrice((current) => current + option.extra!);
      }
    }
  };

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between bg-gray-100 py-4 mb-2">
        <div
          className={`ml-6 text-lg font-semibold flex items-center justify-between w-full ${
            isOptionSelected ? "text-lime-600" : "text-black"
          }`}
        >
          {option.choices?.length === 0 ? (
            <div className="flex items-center justify-between w-full">
              <input
                type="checkbox"
                className="mr-5 cursor-pointer bg-white border border-gray-400 h-5 w-5 rounded-md focus:outline-none 
                "
                onClick={onOptionClick}
                id={option.name}
              />
              <label
                htmlFor={option.name}
                className="cursor-pointer flex items-center justify-between w-full"
              >
                <div>{option.name}</div>
                {option.extra !== 0 && (
                  <div className="mr-6 text-sm opacity-75 text-right w-10">
                    $ {option.extra}
                  </div>
                )}
              </label>
            </div>
          ) : (
            <div>{option.name}</div>
          )}
        </div>
      </div>
      <div className="mx-6">
        {option.choices?.map((choice, index) => (
          <div key={index} className="flex items-center justify-between">
            <div
              className={`flex items-center justify-between w-full mt-2 ${
                isChoiceSelected(dishId, choice.name)
                  ? "text-lime-600"
                  : "text-black"
              }`}
            >
              <input
                type="checkbox"
                id={choice.name}
                onClick={() => {
                  if (isChoiceSelected(dishId, choice.name)) {
                    removeChoiceFromItem(dishId, choice.name);
                    if (choice.extra !== null) {
                      setOrderPrice((current) => current - choice.extra!);
                    }
                  } else {
                    addChoiceToItem(dishId, option.name, choice.name);
                    if (choice.extra !== null) {
                      setOrderPrice((current) => current + choice.extra!);
                    }
                  }
                }}
                className="mr-5 cursor-pointer"
              />

              <label
                htmlFor={choice.name}
                className="cursor-pointer flex items-center justify-between w-full"
              >
                <div>{choice.name}</div>
                <div className="text-sm opacity-75">$ {choice.extra}</div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
