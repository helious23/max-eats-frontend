import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { category, categoryVariables } from "../../__generated__/category";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { PageTitle } from "../../components/page-title";
import { Categories } from "../../components/categories";
import { Pagination } from "../../components/pagination";

interface ICategoryParams {
  slug: string;
}

export const CATEGORY_QUERY = gql`
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
          page,
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

            <Pagination
              onNextPageClick={onNextPageClick}
              onPrevPageClick={onPrevPageClick}
              page={page}
              totalPages={data?.category.totalPages!}
            />
          </div>
        </div>
      )}
    </div>
  );
};
