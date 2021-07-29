import { restaurantsPageQuery_restaurants_results } from "../__generated__/restaurantsPageQuery";

interface IRestaurantProps {
  restaurant: restaurantsPageQuery_restaurants_results;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ restaurant }) => (
  <div className="flex flex-col">
    <div
      style={{ backgroundImage: `url(${restaurant.coverImg})` }}
      className="bg-red-500 py-32 bg-cover bg-center mb-3"
    ></div>
    <h3 className="text-xl font-medium">{restaurant.name}</h3>
    <span className="border-t mt-2 pt-2 border-gray-400 text-sm opacity-50">
      {restaurant.category?.name}
    </span>
  </div>
);
