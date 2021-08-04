import { useParams, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { PageTitle } from "../../components/page-title";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [ksy: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const [choicesNumber, setChoicesNumber] = useState<number[]>([]);
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm<IForm>({
      mode: "onChange",
    });

  const onCompleted = (data: createDish) => {
    const {
      createDish: { ok },
    } = data;
    if (ok) {
      alert("메뉴가 생성되었습니다");
      history.goBack();
    }
  };
  const [createDishMutation, { data: createDishResult, loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: +restaurantId } },
      },
    ],
    // onCompleted,
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();

    const optionOnjects = optionsNumber.map((optionId) =>
      choicesNumber.map((choiceId) => ({
        name: rest[`${optionId}-optionName`],
        extra: +rest[`${optionId}-optionExtra`],
        choices: {
          name: rest[`${optionId}-optionName-${choiceId}-choiceName`],
          extra: +rest[`${optionId}-optionExtra-${choiceId}-choiceExtra`],
        },
      }))
    );
    console.log(optionOnjects);

    // createDishMutation({
    //   variables: {
    //     input: {
    //       name,
    //       price: +price,
    //       description,
    //       resturantId: +restaurantId,
    //       options: optionOnjects,
    //     },
    //   },
    // });
  };

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };

  const onAddChoiceClick = () => {
    setChoicesNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteChoiceClick = (optionId: number, choiceId: number) => {
    setChoicesNumber((current) => current.filter((id) => id !== choiceId));
    setValue(`${optionId}-optionName-${choiceId}-choiceName`, "");
    setValue(`${optionId}-optionExtra-${choiceId}-choiceExtra`, "");
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageTitle title="메뉴 추가" />
      <h4 className="text-2xl mb-3 font-semibold">메뉴를 추가하세요 🍽</h4>
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
            옵션 추가하기
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                  type="text"
                  placeholder="옵션 이름"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                  type="number"
                  min={0}
                  placeholder="옵션 추가 가격"
                />
                <span
                  className="text-gray-300 hover:text-black cursor-pointer mr-5"
                  onClick={() => onDeleteClick(id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
                <span
                  className="text-gray-300 hover:text-black cursor-pointer mr-5"
                  onClick={onAddChoiceClick}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </span>

                {choicesNumber.length !== 0 &&
                  choicesNumber.map((choiceId) => (
                    <div key={choiceId} className="mt-5">
                      <span className="mx-5">추가 옵션 입력</span>
                      <input
                        {...register(`${id}-optionName-${choiceId}-choiceName`)}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                        type="text"
                        placeholder="추가 옵션 이름"
                      />
                      <input
                        {...register(
                          `${id}-optionExtra-${choiceId}-choiceExtra`
                        )}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-5"
                        type="number"
                        min={0}
                        placeholder="추가 옵션 가격"
                      />
                      <span
                        className="text-gray-300 hover:text-black cursor-pointer"
                        onClick={() => onDeleteChoiceClick(id, choiceId)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </div>
                  ))}
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="메뉴 만들기"
        />
        {createDishResult?.createDish.error && (
          <FormError errorMessage={createDishResult.createDish.error} />
        )}
      </form>
    </div>
  );
};
