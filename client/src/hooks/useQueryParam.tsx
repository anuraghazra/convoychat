import { useLocation } from "react-router-dom";

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}

export default useQueryParam;
