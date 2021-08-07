/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderAmountInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrderAmount
// ====================================================

export interface getOrderAmount_getOrderAmount_orders {
  __typename: "Order";
  id: number;
  createdAt: any;
  total: number | null;
}

export interface getOrderAmount_getOrderAmount {
  __typename: "GetOrderAmountOutput";
  error: string | null;
  ok: boolean;
  totalPages: number | null;
  totalResults: number | null;
  orders: getOrderAmount_getOrderAmount_orders[] | null;
}

export interface getOrderAmount {
  getOrderAmount: getOrderAmount_getOrderAmount;
}

export interface getOrderAmountVariables {
  input: GetOrderAmountInput;
}
