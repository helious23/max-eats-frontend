import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";
import { PageTitle } from "../../components/page-title";
import { Dish } from "../../components/dish";
import { useState } from "react";
import { DishOrder } from "../../components/dish-order";

interface IRestaurantParams {
  id: string;
}

export const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const RestaurantDetail = () => {
  const { id } = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +id,
        },
      },
    }
  );
  const [optionClick, setOptionClick] = useState(false);
  const [dishId, setDishId] = useState(0);

  const onDishClick = (dishId: number) => {
    setOptionClick((current) => !current);
    setDishId(dishId);
  };

  const onDishUnclick = () => {
    setOptionClick((current) => !current);
  };

  return (
    <div>
      <PageTitle title={data?.restaurant.restaurant?.name || "Restaurant"} />
      {!loading && (
        <div>
          <div>
            <div className="relative">
              <img
                src={data?.restaurant.restaurant?.coverImg}
                alt={data?.restaurant.restaurant?.name}
                className="w-full h-64"
                style={{ objectFit: "cover" }}
              />
              <div className="w-full h-64 absolute top-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
              <h4 className="text-4xl text-white absolute top-44 pl-10">
                {data?.restaurant.restaurant?.name}
              </h4>
            </div>
          </div>
          <div className="px-10 mt-6">
            <div className="text-base font-light">
              <Link
                className="hover:underline"
                to={`/category/${data?.restaurant.restaurant?.category?.slug}`}
              >
                {data?.restaurant.restaurant?.category?.name}
              </Link>
            </div>
            <div className="text-base mt-2 font-light">
              {data?.restaurant.restaurant?.address}
            </div>
            <div className="w-full border-b border-gray-300 mt-6"></div>
            <div className="mt-10 font-bold text-2xl">메뉴를 선택하세요!</div>
          </div>

          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 my-10 px-10 pb-20">
            {data?.restaurant.restaurant?.menu.map((dish, index) => (
              <div key={index}>
                <div
                  onClick={() => onDishClick(dish.id)}
                  className="h-full cursor-pointer"
                >
                  <Dish
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    photo={dish.photo}
                  />
                </div>
                <div className={optionClick ? "" : "hidden"}>
                  {dish.id === dishId && (
                    <DishOrder
                      restaurantId={id}
                      dish={dish}
                      onDishUnclick={onDishUnclick}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
