import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ORDERS_FRAGMENT } from "../fragment";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...OrderParts
        status
        driver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
  ${ORDERS_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  console.log(data);
  return <div className="container">{id}</div>;
};
