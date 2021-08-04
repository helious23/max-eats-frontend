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
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const { id } = useParams<IParams>();
  const history = useHistory();
  const { register, handleSubmit, formState, setValue } = useForm<IForm>({
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
      { query: MY_RESTAURANT_QUERY, variables: { input: { id: +id } } },
    ],
    // onCompleted,
  });

  const onSubmit = (data: IForm) => {
    const { name, price, description, ...rest } = data;
    console.log(rest);
    // createDishMutation({
    //   variables: {
    //     input: {
    //       name,
    //       price: +price,
    //       description,
    //       resturantId: +id,
    //     },
    //   },
    // });
  };

  const [optionsNumber, setOptionsNumber] = useState(0);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => current + 1);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current - 1);
    //@ts-ignore
    setValue(`${idToDelete}-optionName`, "");
    //@ts-ignore
    setValue(`${idToDelete}-optionExtra`, "");
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
          {optionsNumber !== 0 &&
            Array.from(new Array(optionsNumber)).map((_, index) => (
              <div key={index} className="mt-5">
                <input
                  // @ts-ignore
                  {...register(`${index}-optionName`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                  type="text"
                  placeholder="옵션 이름"
                />
                <input
                  //@ts-ignore
                  {...register(`${index}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                  type="number"
                  min={0}
                  placeholder="옵션 추가 가격"
                />
                <span
                  className="text-gray-300 hover:text-black cursor-pointer"
                  onClick={() => onDeleteClick(index)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
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
