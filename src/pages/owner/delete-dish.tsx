import { FormError } from "../../components/form-error";
import { useMutation, gql } from "@apollo/client";
import {
  deleteDish,
  deleteDishVariables,
} from "../../__generated__/deleteDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { useHistory } from "react-router-dom";

const DELETE_DISH_MUTATION = gql`
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`;

interface IDeleteDishProps {
  dishId: string;
  restaurantId: string;
}

export const DeleteDish: React.FC<IDeleteDishProps> = ({
  dishId,
  restaurantId,
}) => {
  const history = useHistory();
  const [deleteDishMutation, { data: deleteDishData, loading: deleteLoading }] =
    useMutation<deleteDish, deleteDishVariables>(DELETE_DISH_MUTATION, {
      refetchQueries: [
        {
          query: MY_RESTAURANT_QUERY,
          variables: { input: { id: +restaurantId } },
        },
      ],
    });

  const onSubmit = () => {
    if (window.confirm("메뉴를 삭제하시겠습니까?")) {
      deleteDishMutation({
        variables: {
          input: {
            dishId: +dishId,
          },
        },
      });
      alert("메뉴가 삭제되었습니다");
      history.push(`/restaurant/${restaurantId}`);
    } else {
      history.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <form className="max-w-screen-sm w-full">
      <button
        onClick={onSubmit}
        className={
          "text-white py-3 transition-colors text-lg font-medium focus:outline-none bg-red-500 w-full hover:bg-red-700"
        }
      >
        {deleteLoading ? "로딩중..." : "메뉴 삭제하기"}
      </button>
      {deleteDishData?.deleteDish.error && (
        <FormError errorMessage={deleteDishData.deleteDish.error} />
      )}
    </form>
  );
};
