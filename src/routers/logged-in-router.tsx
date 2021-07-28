import { gql, useQuery } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { meQuery } from "../__generated__/meQuery";
import routes from "../routes";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";

const ClientRoutes = () => (
  <>
    <Route path={routes.home} exact>
      <Restaurants />
    </Route>
  </>
);

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && <ClientRoutes />}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
