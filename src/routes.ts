const routes = {
  home: "/",
  createAccount: "/create-account",
  confirmEmail: "/confirm",
  editProfile: "/edit-profile",
  search: "/search",
  category: "/category/:slug",
  restaurant: "/restaurant/:id",
  addRestaurant: "/add-restaurant",
  addDish: "/restaurant/:restaurantId/add-dish",
  editDish: "/restaurant/:restaurantId/edit-dish/:dishId",
  orders: "/orders/:id",
  notice: "/notice",
};

export default routes;
