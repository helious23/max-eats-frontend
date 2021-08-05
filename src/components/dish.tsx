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
    <div className=" border hover:border-gray-800 transition-all grid grid-cols-3">
      <div className="px-5 pt-4 pb-6 mb-8 col-span-2 flex flex-col h-full">
        <div className="flex flex-col items-start h-full">
          <div className="text-base font-normal">{name}</div>
          <div className="font-light text-sm">{description}</div>
        </div>
        <div className="flex items-end h-full">
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
