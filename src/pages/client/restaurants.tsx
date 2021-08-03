import { PageTitle } from "../../components/page-title";
import { gql, useQuery } from "@apollo/client";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Categories } from "../../components/categories";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/form-error";
import { useHistory } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import routes from "../../routes";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";

export const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Restaurants: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  interface IFormProps {
    searchTerm: string;
  }

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { register, handleSubmit, formState } = useForm<IFormProps>();
  const history = useHistory();

  const onSearchSubmit = (data: IFormProps) => {
    const { searchTerm } = data;
    history.push({
      pathname: routes.search,
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <PageTitle title={"온라인으로 음식을 주문하세요"} />
      <form
        className="bg-gray-800 w-full py-32 flex items-center justify-center flex-col"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          {...register("searchTerm", {
            required: "식당 이름을 입력해 주세요",
            minLength: {
              value: 2,
              message: "최소 두글자 이상으로 입력해주세요",
            },
          })}
          className="input w-3/4 md:w-4/12 rounded-md border-0 mb-3"
          type="search"
          placeholder="식당을 검색하세요..."
        />
        {formState.errors.searchTerm?.message && (
          <FormError errorMessage={formState.errors.searchTerm?.message} />
        )}
      </form>
      {!loading && (
        <div className="container">
          <div className="flex justify-start max-w-md overflow-hidden md:justify-around md:max-w-3xl mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Categories
                id={category.id}
                key={category.id}
                name={category.name}
                coverImg={category.coverImg}
                slug={category.slug}
              />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-16">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center justify-center mx-auto mt-10">
            {page > 1 ? (
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="focus:outline-none text-xl cursor-pointer"
                  onClick={onPrevPageClick}
                />
              </div>
            ) : (
              <div></div>
            )}
            <span className="flex justify-center">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="focus:outline-none text-xl cursor-pointer"
                  onClick={onNextPageClick}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
