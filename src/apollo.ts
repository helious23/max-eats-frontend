import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./constant";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

console.log(isLoggedInVar());
console.log(authToken());

export const logUserIn = (token: string) => {
  localStorage.setItem(LOCALSTORAGE_TOKEN, token);
  authToken(token);
  isLoggedInVar(true);
};

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    // typePolicies: {
    //   // local state 를 cache 에 저장하는 법
    //   // DB 에 접근하지 않고 browser 에서 쓸 수 있는 query 생성
    //   Query: {
    //     fields: {
    //       isLoggedIn: {
    //         read() {
    //           return isLoggedInVar();
    //         },
    //       },
    //       token: {
    //         read() {
    //           return authToken();
    //         },
    //       },
    //     },
    //   },
    // },
  }),
});
