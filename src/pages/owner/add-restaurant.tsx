import {
  gql,
  useMutation,
  useApolloClient,
  useLazyQuery,
} from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { PageTitle } from "../../components/page-title";
import { useState } from "react";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";
import routes from "../../routes";
import {
  checkRestaurant,
  checkRestaurantVariables,
} from "../../__generated__/checkRestaurant";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

const CHECK_RESTAURANT_QUERY = gql`
  query checkRestaurant($input: CheckRestaurantInput!) {
    checkRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  categoryFile: FileList;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { register, formState, handleSubmit, getValues } = useForm<IFormProps>({
    mode: "onChange",
  });

  const { name } = getValues();

  const [callQuery, { data: checkdata }] = useLazyQuery<
    checkRestaurant,
    checkRestaurantVariables
  >(CHECK_RESTAURANT_QUERY, {
    variables: {
      input: {
        name,
      },
    },
  });

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({
        query: MY_RESTAURANTS_QUERY,
        variables: { input: { page: 1 } },
      }); // page 1 의 cache data 읽음
      console.log(queryResult);
      if (queryResult) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          variables: { input: { page: 1 } },
          data: {
            myRestaurants: {
              ...queryResult.myRestaurants, // 기존 cache 에 있는 data
              totalResults: queryResult.myRestaurants?.totalResults + 1,
              totalPages: Math.ceil(
                (queryResult.myRestaurants?.totalResults + 1) / 9
              ),
              restaurants: [
                {
                  address,
                  category: {
                    name: categoryName,
                    slug: categoryName.replace(/ +/g, "-"),
                    __typename: "Category",
                  },
                  coverImg: imageUrl,
                  id: restaurantId,
                  isPromoted: false,
                  name,
                  __typename: "Restaurant",
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
      }
      alert("식당이 등록 되었습니다");
      history.push(routes.home);
    }
    setUploading(false);
  };

  const [createRestaurantMutation, { data: createRestaurantResult }] =
    useMutation<createRestaurant, createRestaurantVariables>(
      CREATE_RESTAURANT_MUTATION,
      {
        onCompleted,
      }
    );

  const onCheck = () => {
    callQuery();
  };

  const onSubmit = async (data: IFormProps) => {
    try {
      setUploading(true);
      const { file, name, categoryName, address, categoryFile } = data;

      // restaurant image
      const actualImage = file[0];
      const formBody = new FormData();
      formBody.append("file", actualImage);
      const { url: coverImg } = await (
        await fetch("https://max-eats-backend.herokuapp.com/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);

      // category image
      const categoryActualImage = categoryFile[0];
      const categoryFormBody = new FormData();
      categoryFormBody.append("file", categoryActualImage);
      const { url: categoryImg } = await (
        await fetch("https://max-eats-backend.herokuapp.com/uploads/", {
          method: "POST",
          body: categoryFormBody,
        })
      ).json();

      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
            categoryImg,
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
        <div className="flex justify-starat items-center">
          <input
            className="input w-5/6"
            {...register("name", {
              required: "식당 이름은 필수 입력 사항 입니다",
              minLength: {
                value: 2,
                message: "식당 이름은 두글자 이상이 필요합니다",
              },
            })}
            placeholder="식당 이름"
            type="text"
            required
          />
          <div className="flex w-1/6 items-center justify-center">
            <span
              className="flex justify-center bg-lime-600 text-white py-2 px-4 cursor-pointer"
              onClick={() => onCheck()}
            >
              중복 검사
            </span>
          </div>
        </div>
        {checkdata?.checkRestaurant.error && (
          <FormError errorMessage={checkdata?.checkRestaurant.error} />
        )}
        {checkdata?.checkRestaurant.ok && (
          <span role="alert" className="font-medium text-lime-600 text-center">
            등록 가능한 식당입니다
          </span>
        )}
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
        <div className="grid gap-3 grid-cols-2 items-center border py-2 px-2 text-lg">
          <span className="text-gray-400"> 카테고리 이미지 등록하기 </span>
          <input
            type="file"
            accept="image/*"
            {...register("categoryFile", { required: true })}
          />
        </div>
        <div className="grid gap-3 grid-cols-2 items-center border py-2 px-2 text-lg">
          <span className="text-gray-400"> 대표 사진 등록하기 </span>
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
