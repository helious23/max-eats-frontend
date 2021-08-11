import { FieldValues, UseFormRegister } from "react-hook-form";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";
import { CreateOrderItemInput } from "../__generated__/globalTypes";

interface IDishOptionProps {
  dishId: number;
  isOptionSelected: boolean;
  orderItems: CreateOrderItemInput[];
  register: UseFormRegister<FieldValues>;
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
  register,
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
          className={`ml-6 text-lg font-semibold flex items-center ${
            isOptionSelected ? "text-lime-600" : "text-black"
          }`}
        >
          {option.choices?.length === 0 && (
            <input
              {...register(`${option.name}`)}
              type="checkbox"
              id={option.name}
              name={option.name}
              onClick={onOptionClick}
              value={[option.name]}
              className="mr-5"
            />
          )}
          <div>{option.name}</div>
        </div>
        {option.extra !== 0 && (
          <div className="mr-6 text-sm opacity-75">$ {option.extra}</div>
        )}
      </div>
      <div className="mx-6">
        {option.choices?.map((choice, index) => (
          <div key={index} className="flex items-center justify-between">
            <div
              className={`flex items-center ${
                isChoiceSelected(dishId, choice.name)
                  ? "text-lime-600"
                  : "text-black"
              }`}
            >
              <input
                {...register(`${choice.name}`)}
                type="checkbox"
                id={choice.name}
                name={choice.name}
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
                value={[option.name, choice.name]}
                className="mr-5"
              />

              <div className=" mt-1">{choice.name}</div>
            </div>
            <div className="text-sm opacity-75">$ {choice.extra}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
