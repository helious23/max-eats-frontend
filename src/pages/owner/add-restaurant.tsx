import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { PageTitle } from "../../components/page-title";
import { useState } from "react";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { FormError } from "../../components/form-error";

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
  file: FileList;
}

export const AddRestaurant = () => {
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };

  const [createRestaurantMutation, { data: createRestaurantResult }] =
    useMutation<createRestaurant, createRestaurantVariables>(
      CREATE_RESTAURANT_MUTATION,
      {
        onCompleted,
      }
    );

  const [uploading, setUploading] = useState(false);

  const { register, formState, handleSubmit } = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit = async (data: IFormProps) => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = data;
      const actualImage = file[0];
      const formBody = new FormData();
      formBody.append("file", actualImage);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <PageTitle title={"식당 등록하기"} />
      <div className="font-semibold text-2xl mb-3">식당을 등록하세요</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          {...register("name", {
            required: "식당 이름은 필수 입력 사항 입니다",
          })}
          placeholder="식당 이름"
          type="text"
          required
        />
        {formState.errors.name?.message && (
          <FormError errorMessage={formState.errors.name?.message} />
        )}
        <input
          className="input"
          {...register("address", {
            required: "주소는 필수 입력 사항 입니다",
          })}
          placeholder="주소"
          type="text"
          required
        />
        {formState.errors.address?.message && (
          <FormError errorMessage={formState.errors.address?.message} />
        )}
        <input
          className="input"
          {...register("categoryName", {
            required: "카테고리는 필수 입력 사항 입니다",
          })}
          placeholder="카테고리"
          type="text"
          required
        />
        {formState.errors.categoryName?.message && (
          <FormError errorMessage={formState.errors.categoryName?.message} />
        )}
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("file", { required: true })}
          />
        </div>
        <Button
          canClick={formState.isValid}
          loading={uploading}
          actionText="식당 등록하기"
        />
        {createRestaurantResult?.createRestaurant.error && (
          <FormError
            errorMessage={createRestaurantResult.createRestaurant.error}
          />
        )}
      </form>
    </div>
  );
};
