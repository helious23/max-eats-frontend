import { restaurantsPageQuery_allCategories_categories } from "../__generated__/restaurantsPageQuery";

interface ICategoriesProps {
  category: restaurantsPageQuery_allCategories_categories;
}

export const Categories: React.FC<ICategoriesProps> = ({ category }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div
        className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-100 cursor-pointer"
        style={{ backgroundImage: `url(${category.coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium">
        {category.name}
      </span>
    </div>
  );
};
