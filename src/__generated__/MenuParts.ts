/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MenuParts
// ====================================================

export interface MenuParts_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface MenuParts_options {
  __typename: "DishOption";
  name: string;
  choices: MenuParts_options_choices[] | null;
  extra: number | null;
}

export interface MenuParts {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: MenuParts_options[] | null;
}
