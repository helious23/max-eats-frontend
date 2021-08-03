import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { PageTitle } from "../../components/page-title";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { data, loading }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit = (data: IFormProps) => {
    console.log(data);
  };

  return (
    <div className="container">
      <PageTitle title={"식당 등록하기"} />
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          {...register("name", {
            required: "식당 이름은 필수 입력 사항 입니다",
          })}
          placeholder="식당 이름"
          type="text"
          required
        />
        <input
          className="input"
          {...register("address", {
            required: "주소는 필수 입력 사항 입니다",
          })}
          placeholder="주소"
          type="text"
          required
        />
        <input
          className="input"
          {...register("categoryName", {
            required: "카테고리는 필수 입력 사항 입니다",
          })}
          placeholder="카테고리"
          type="text"
          required
        />
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText="식당 등록하기"
        />
      </form>
    </div>
  );
};
