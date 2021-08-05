/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CheckRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: checkRestaurant
// ====================================================

export interface checkRestaurant_checkRestaurant {
  __typename: "CheckRestaurantOutput";
  ok: boolean;
  error: string | null;
}

export interface checkRestaurant {
  checkRestaurant: checkRestaurant_checkRestaurant;
}

export interface checkRestaurantVariables {
  input: CheckRestaurantInput;
}
