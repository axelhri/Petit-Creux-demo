import { useRouteError } from "react-router-dom";

function SingleError() {
  const error = useRouteError();
  console.log(error);

  return <h2>{error.message}</h2>;
}

export default SingleError;
