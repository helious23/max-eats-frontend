/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CheckRestaurantInput {
  name: string;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateDishInput {
  name: string;
  price: number;
  photo?: string | null;
  description: string;
  options?: DishOptionInputType[] | null;
  resturantId: number;
}

export interface CreateRestaurantInput {
  name: string;
  coverImg: string;
  address: string;
  categoryName: string;
}

export interface DeleteDishInput {
  dishId: number;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishOptionInputType {
  name: string;
  choices?: DishChoiceInputType[] | null;
  extra?: number | null;
}

export interface EditDishInput {
  name?: string | null;
  price?: number | null;
  description?: string | null;
  options?: DishOptionInputType[] | null;
  dishId: number;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyRestaurantInput {
  id: number;
}

export interface MyRestaurantsInput {
  page?: number | null;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
