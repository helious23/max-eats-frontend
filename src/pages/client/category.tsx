import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { category, categoryVariables } from "../../__generated__/category";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { PageTitle } from "../../components/page-title";
import { Categories } from "../../components/categories";

interface ICategoryParams {
  slug: string;
}

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <PageTitle title={params.slug.toUpperCase()} />
      {!loading && (
        <div>
          {data?.category.category && (
            <Categories
              id={data.category.category.id}
              key={data.category.category.id}
              name={data.category.category.name}
              coverImg={data.category.category.coverImg}
              slug={data.category.category.slug}
            />
          )}
          <div className="max-w-screen-xl mx-auto mt-8 pb-20">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-16">
              {data?.category.restaurants?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
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
                Page {page} of {data?.category.totalPages}
              </span>
              {page !== data?.category.totalPages ? (
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
        </div>
      )}
    </div>
  );
};
