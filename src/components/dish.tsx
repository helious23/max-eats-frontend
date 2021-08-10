import React from "react";

interface IDishProps {
  name: string;
  description: string;
  price: number;
  photo: string | null;
}

export const Dish: React.FC<IDishProps> = ({
  description,
  name,
  price,
  photo,
}) => {
  return (
    <div className=" border-2 hover:border-gray-800 transition-all grid grid-cols-3 min-h-full h-44 overflow-hidden">
      <div className="px-5 pt-4 pb-6 col-span-2 flex flex-col min-h-full">
        <div className="flex flex-col items-start h-3/4 overflow-hidden">
          <div className="text-base font-normal h-1/2 overflow-hidden w-full overflow-ellipsis break-words">
            {name}
          </div>
          <div className="font-light text-sm h-1/2 w-full overflow-ellipsis break-words overflow-hidden">
            {description}
          </div>
        </div>
        <div className="flex items-end h-1/4">
          <div className="font-light">$ {price}</div>
        </div>
      </div>
      <div
        style={{ backgroundImage: `url(${photo})` }}
        className="bg-cover bg-center"
      ></div>
    </div>
  );
};
