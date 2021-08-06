import { gql, useQuery, useMutation } from "@apollo/client";
import { PageTitle } from "../../components/page-title";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/form-error";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/button";
import { v4 as uuidv4 } from "uuid";
import { useParams, useHistory } from "react-router-dom";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { editDish, editDishVariables } from "../../__generated__/editDish";
import { DeleteDish } from "./delete-dish";

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
  dishId: string;
}

interface IChoices {
  __typename: "DishChoice";
  id: string;
  name: string;
  extra: number | null;
}

interface IOptions {
  __typename: "DishOption";
  id: string;
  name: string;
  extra: number | null;
  choices: IChoices[] | null;
}

interface IDish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: IOptions[] | null;
}

export const EditDish = () => {
  const { register, handleSubmit, formState, setValue, getValues } = useForm();
  const { restaurantId, dishId } = useParams<IParams>();
  const [dish, setDish] = useState<IDish>();
  const history = useHistory();

  const { data: restaurantData } = useQuery<
    myRestaurant,
    myRestaurantVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +restaurantId,
      },
    },
  });

  const onCompleted = (data: editDish) => {
    const {
      editDish: { ok },
    } = data;
    if (ok) {
      alert("메뉴가 수정되었습니다");
      history.goBack();
    }
  };

  const [editDishMutation, { data: editDishData, loading: editLoading }] =
    useMutation<editDish, editDishVariables>(EDIT_DISH_MUTATION, {
      refetchQueries: [
        {
          query: MY_RESTAURANT_QUERY,
          variables: { input: { id: +restaurantId } },
        },
      ],
      onCompleted,
    });

  const onSubmit = async () => {
    const { name, price, description, ...rest } = getValues();
    const optionObject = options.map((option) => ({
      name: rest[`${option.id}-optionName`],
      extra: +rest[`${option.id}-optionExtra`],
      choices: option.choices.map((choice) => ({
        name: rest[`${choice}-choiceName`],
        extra: +rest[`${choice}-choiceExtra`],
      })),
    }));
    const dishOptionObject = dish!.options?.map((dishOption) => ({
      name: rest[`${dishOption.id}-optionName`],
      extra: +rest[`${dishOption.id}-optionExtra`],
      choices: dishOption!.choices?.map((choice) => ({
        name: rest[`${choice.id}-choiceName`],
        extra: +rest[`${choice.id}-choiceExtra`],
      })),
    }));

    editDishMutation({
      variables: {
        input: {
          dishId: +dishId,
          name,
          price: +price,
          description,
          options: [...optionObject, ...dishOptionObject!],
        },
      },
    });
  };

  const [options, setOptions] = useState<{ id: number; choices: number[] }[]>(
    []
  );

  const onAddOptionClick = () => {
    setOptions((current) => [{ id: Date.now(), choices: [] }, ...current]);
  };

  const onDeleteClick = (idToDelete: number | string, optionName?: string) => {
    if (typeof idToDelete === "number" && idToDelete.toString().length === 13) {
      setOptions((current) =>
        // 삭제하는 옵션 중 choices 있다면 choices까지 전부 값 초기화
        current
          .map((option) => {
            if (option.id === idToDelete) {
              option.choices.map((choice) => {
                setValue(`${choice}-choiceName`, "");
                setValue(`${choice}-choiceExtra`, "");
                return choice;
              });
            }
            return option;
          })
          .filter((option) => option.id !== idToDelete)
      );
    } else {
      setDish((current) => ({
        ...current!,
        options: current!
          .options!.map((option) => {
            option.choices?.forEach((choice) => {
              setValue(`${choice.id}-choiceName`, "");
              setValue(`${choice.id}-choiceExtra`, "");
            });
            return option;
          })
          .filter((option) => option.name !== optionName),
      }));
    }
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };

  const onAddChoiceClick = (id: number | string) => {
    if (typeof id === "number" && id.toString().length === 13) {
      setOptions((current) =>
        current.map((option) => {
          if (option.id === id) {
            return {
              id: option.id,
              choices: [Date.now(), ...option.choices],
            };
          }
          return option;
        })
      );
    } else {
      setDish((current) => ({
        ...current!,
        options: current!.options!.map((option) => {
          if (option.id === id) {
            return {
              ...option,
              choices: [
                {
                  __typename: "DishChoice",
                  name: "",
                  extra: 0,
                  id: uuidv4(),
                },
                ...option.choices!,
              ],
            };
          }
          return option;
        }),
      }));
    }
  };

  const onDeleteChoiceClick = (
    idToDelete: number | string,
    subIdxToDelete?: number | string,
    choiceName?: string
  ) => {
    if (typeof idToDelete === "number" && idToDelete.toString().length === 13) {
      setOptions((current) =>
        // choices 삭제
        current.map((option) => ({
          id: option.id,
          choices: option.choices.filter((choice) => choice !== idToDelete),
        }))
      );
      setValue(`${idToDelete}-choiceName`, "");
      setValue(`${idToDelete}-choiceExtra`, "");
    } else {
      setDish((current) => ({
        ...current!,
        options: current!.options!.map((option) => ({
          ...option!,
          choices: option.choices!.filter(
            (choice) => choice.id !== subIdxToDelete
          ),
        })),
      }));
      setValue(`${subIdxToDelete}-choiceName`, "");
      setValue(`${subIdxToDelete}-choiceExtra`, "");
    }
  };

  useEffect(() => {
    if (restaurantData) {
      let result: IDish;
      const findData = restaurantData.myRestaurant.restaurant?.menu.find(
        (dish) => dish.id === +dishId
      );
      result = {
        ...findData!,
        options:
          findData?.options! &&
          findData!.options!.map((option) => ({
            ...option,
            id: uuidv4(),
            choices:
              option.choices! &&
              option.choices!.map((choice) => ({
                ...choice,
                id: uuidv4(),
              })),
          })),
      };
      setDish(result);
    }
  }, [restaurantData, dishId]);

  useEffect(() => {
    if (dish && dish.options !== undefined) {
      setValue("name", dish.name);
      setValue("price", dish.price.toString());
      setValue("description", dish.description);
      dish.options?.forEach((option) => {
        setValue(`${option.id}-optionName`, option.name);
        setValue(`${option.id}-optionExtra`, option.extra!.toString());
        option.choices?.forEach((choice) => {
          setValue(`${choice.id}-choiceName`, choice.name);
          setValue(`${choice.id}-choiceExtra`, choice.extra!.toString());
        });
      });
    }
  });

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageTitle title="메뉴 수정" />
      <h4 className="text-2xl mb-3 font-semibold">메뉴를 수정하세요 ✏️</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 my-5 w-full"
      >
        <input
          className="input"
          type="text"
          {...register("name", {
            required: "메뉴 이름은 필수 입력 사항입니다",
          })}
          placeholder="메뉴 이름"
        />
        {formState.errors.name?.message && (
          <FormError errorMessage={formState.errors.name?.message} />
        )}
        <input
          className="input"
          type="number"
          min={0}
          {...register("price", { required: "가격은 필수 입력 사항입니다" })}
          placeholder="가격"
        />
        {formState.errors.price?.message && (
          <FormError errorMessage={formState.errors.price?.message} />
        )}
        <input
          className="input"
          type="text"
          {...register("description", { required: "메뉴 설명이 필요합니다" })}
          placeholder="메뉴 설명"
        />
        {formState.errors.description?.message && (
          <FormError errorMessage={formState.errors.description?.message} />
        )}
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">메뉴 옵션</h4>
          <span
            onClick={onAddOptionClick}
            className="text-white bg-gray-900 py-1 px-2 mt-5 cursor-pointer hover:opacity-70"
          >
            옵션 수정 및 추가하기
          </span>
          {options.length !== 0 &&
            options.map((option) => (
              <div key={option.id} className="mt-5">
                <input
                  {...register(`${option.id}-optionName`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                  type="text"
                  placeholder="옵션 이름"
                />
                <input
                  {...register(`${option.id}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                  type="number"
                  min={0}
                  placeholder="옵션 추가 가격"
                />
                <span
                  className="text-gray-300 hover:text-black cursor-pointer mr-5"
                  onClick={() => onDeleteClick(option.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
                <span
                  className="text-gray-300 hover:text-black cursor-pointer mr-5"
                  onClick={() => onAddChoiceClick(option.id)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </span>

                {option.choices.length !== 0 &&
                  option.choices.map((choice) => (
                    <div key={choice} className="mt-5">
                      <span className="mx-5">추가 옵션 입력</span>
                      <input
                        {...register(`${choice}-choiceName`)}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                        type="text"
                        placeholder="추가 옵션 이름"
                      />
                      <input
                        {...register(`${choice}-choiceExtra`)}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                        type="number"
                        min={0}
                        placeholder="추가 옵션 가격"
                      />
                      <span
                        className="text-gray-300 hover:text-black cursor-pointer"
                        onClick={() => onDeleteChoiceClick(choice)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </div>
                  ))}
                {dish &&
                  dish.options?.length !== 0 &&
                  dish.options?.map((dishOption) => (
                    <div key={dishOption.id} className="mt-5">
                      <input
                        {...register(`${dishOption.id}-optionName`)}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                        type="text"
                        placeholder="옵션 이름"
                      />
                      <input
                        {...register(`${dishOption.id}-optionExtra`)}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                        type="number"
                        min={0}
                        placeholder="옵션 추가 가격"
                      />
                      <span
                        className="text-gray-300 hover:text-black cursor-pointer mr-5"
                        onClick={() =>
                          onDeleteClick(dishOption.id, dishOption.name)
                        }
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                      <span
                        className="text-gray-300 hover:text-black cursor-pointer mr-5"
                        onClick={() => onAddChoiceClick(dishOption.id)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </span>

                      {dishOption.choices?.length !== 0 &&
                        dishOption.choices?.map((choice) => (
                          <div key={choice.id} className="mt-5">
                            <span className="mx-5">추가 옵션 입력</span>
                            <input
                              {...register(`${choice.id}-choiceName`)}
                              className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                              type="text"
                              placeholder="추가 옵션 이름"
                            />
                            <input
                              {...register(`${choice.id}-choiceExtra`)}
                              className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                              type="number"
                              min={0}
                              placeholder="추가 옵션 가격"
                            />
                            <span
                              className="text-gray-300 hover:text-black cursor-pointer"
                              onClick={() =>
                                onDeleteChoiceClick(
                                  choice.id,
                                  choice.id,
                                  choice.name
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </span>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
        </div>
        <Button
          loading={editLoading}
          canClick={true}
          actionText="메뉴 수정하기"
        />
        {editDishData?.editDish.error && (
          <FormError errorMessage={editDishData.editDish.error} />
        )}
      </form>
      <DeleteDish dishId={dishId} restaurantId={restaurantId} />
    </div>
  );
};
