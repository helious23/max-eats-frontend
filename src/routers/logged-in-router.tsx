import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import routes from "../routes";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";

const ClientRoutes = [
  <Route key={routes.home} path={routes.home} exact>
    <Restaurants />
  </Route>,
  <Route key={routes.confirmEmail} path={routes.confirmEmail}>
    <ConfirmEmail />
  </Route>,
  <Route key={routes.confirmEmail} path={routes.editProfile}>
    <EditProfile />
  </Route>,
  <Route key={routes.search} path={routes.search}>
    <Search />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="mt-64 flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
