import { useLocation } from "react-router-dom";
export const useQueryParam = () => {
  return new URLSearchParams(useLocation().search);
};
