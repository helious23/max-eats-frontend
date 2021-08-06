import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import routes from "../routes";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { RestaurantDetail } from "../pages/client/restaurant-detail";
import { UserRole } from "../__generated__/globalTypes";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { EditDish } from "../pages/owner/edit-dish";

const clientRoutes = [
  {
    path: routes.home,
    component: <Restaurants />,
  },
  {
    path: routes.search,
    component: <Search />,
  },
  {
    path: routes.category,
    component: <Category />,
  },
  {
    path: routes.restaurant,
    component: <RestaurantDetail />,
  },
];

const commonRoutes = [
  {
    path: routes.confirmEmail,
    component: <ConfirmEmail />,
  },
  {
    path: routes.editProfile,
    component: <EditProfile />,
  },
];

const ownerRoutes = [
  {
    path: routes.home,
    component: <MyRestaurants />,
  },
  {
    path: routes.addRestaurant,
    component: <AddRestaurant />,
  },
  {
    path: routes.restaurant,
    component: <MyRestaurant />,
  },
  {
    path: routes.addDish,
    component: <AddDish />,
  },
  {
    path: routes.editDish,
    component: <EditDish />,
  },
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
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact>
            {route.component}
          </Route>
        ))}
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
