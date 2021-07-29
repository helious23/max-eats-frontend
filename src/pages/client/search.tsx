import { useQueryParam } from "../../hooks/useQueryParam";

export const Search = () => {
  const param = useQueryParam();
  const code = param.get("term");
  console.log(code);

  return <h1>Search page</h1>;
};
