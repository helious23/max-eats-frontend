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
  const [options, setOptions] = useState<{ id: number; choices: number[] }[]>(
    []
  );

  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm<IForm>({
    mode: "onChange",
  });

  const onCompleted = (data: createDish) => {
    const {
      createDish: { ok },
    } = data;
    if (ok) {
      setUploading(false);
      alert("메뉴가 생성되었습니다");
      history.goBack();
    }
  };
  const [createDishMutation, { data: createDishResult }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: +restaurantId } },
      },
    ],
    onCompleted,
  });

  const onSubmit = async (data: IForm) => {
    setUploading(true);
    const { file, name, price, description, ...rest } = data;
    const actualImage = file[0];
    const formBody = new FormData();
    formBody.append("file", actualImage);
    const { url: photo } = await (
      await fetch("https://max-eats-backend.herokuapp.com/uploads/", {
        method: "POST",
        body: formBody,
      })
    ).json();

    const optionObject = options.map((option) => ({
      name: rest[`${option.id}-optionName`],
      extra: +rest[`${option.id}-optionExtra`],
      choices: option.choices.map((choice) => ({
        name: rest[`${choice}-choiceName`],
        extra: +rest[`${choice}-choiceExtra`],
      })),
    }));

    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          resturantId: +restaurantId,
          options: optionObject,
          photo,
        },
      },
    });
  };

  const onAddOptionClick = () => {
    setOptions((current) => [{ id: Date.now(), choices: [] }, ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
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
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };

  const onAddChoiceClick = (id: number) => {
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
  };

  const onDeleteChoiceClick = (idToDelete: number) => {
    setOptions((current) =>
      // choices 삭제
      current.map((option) => ({
        id: option.id,
        choices: option.choices.filter((choice) => choice !== idToDelete),
      }))
    );
    setValue(`${idToDelete}-choiceName`, "");
    setValue(`${idToDelete}-choiceExtra`, "");
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
        <div className="grid gap-3 grid-cols-2 items-center border py-2 px-2 text-lg">
          <span className="text-gray-400"> 메뉴 사진 등록하기 </span>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">메뉴 옵션</h4>
          <span
            onClick={onAddOptionClick}
            className="text-white bg-gray-900 py-1 px-2 mt-5 cursor-pointer hover:opacity-70"
          >
            옵션 추가하기
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
              </div>
            ))}
        </div>
        <Button
          loading={uploading}
          disabled={uploading}
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
