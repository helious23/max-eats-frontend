import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { PageTitle } from "../../components/page-title";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput) {
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
  const { register, handleSubmit, formState, getValues } = useForm<IForm>({
    mode: "onChange",
  });
  const [createDishMutation, { data: createDishResult, loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION);

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageTitle title="메뉴 추가" />
      <h4 className="text-2xl mb-3 font-semibold">메뉴를 추가하세요</h4>
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
          type="price"
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
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="메뉴 만들기"
        />
      </form>
    </div>
  );
};
