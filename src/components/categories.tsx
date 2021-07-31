import { Link } from "react-router-dom";

interface ICategoriesProps {
  id: number;
  name: string;
  slug: string;
  coverImg: string | null;
}

export const Categories: React.FC<ICategoriesProps> = ({
  id,
  slug,
  name,
  coverImg,
}) => {
  return (
    <Link key={id} to={`/category/${slug}`}>
      <div className="flex flex-col items-center cursor-pointer group">
        <div
          className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100 cursor-pointer"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <span className="mt-1 text-sm text-center font-medium">{name}</span>
      </div>
    </Link>
  );
};
