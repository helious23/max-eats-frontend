import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: number;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => (
  <Link key={id} to={`/restaurant/${id}`}>
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImg})` }}
        className="py-32 bg-cover bg-center mb-3"
      ></div>
      <h3 className="text-xl font-medium">{name}</h3>
      <span className="border-t mt-2 pt-2 border-gray-400 text-sm opacity-50">
        {categoryName}
      </span>
    </div>
  </Link>
);
