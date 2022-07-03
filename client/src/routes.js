import React from "react";

import Admin from "./views/admin/dashboard/Dashboard";

import SalesPage from "./views/user/sale/Sale";

import LogPage from "./views/user/sale/Log";

// import MePage from "./views/user/me/Content";
import Sales from "./views/admin/sales/Log";
import UserAction from "./views/admin/useraction/Log";
import Create from "./views/admin/useraction/Create";
import AdminProfile from "./views/admin/profile/Content";

const routes = [
  // { path: "/", exact: true, name: "Home" },
  { path: "/dashboard/admin", name: "Admin", component: Admin, exact: true },

  {
    path: "/dashboard/user/sale",
    name: "Sales",
    component: SalesPage,
    exact: true,
  },

  {
    path: "/dashboard/user/sale/log",
    name: "Log",
    component: LogPage,
    exact: true,
  },

  {
    path: "/dashboard/admin/sales-log",
    name: "Sales Log",
    component: Sales,
    exact: true,
  },

  {
    path: "/dashboard/admin/product-catlog",
    name: "Products",
    component: UserAction,
    exact: true,
  },

  {
    path: "/dashboard/admin/create-product",
    name: "Create product",
    component: Create,
    exact: true,
  },
  {
    path: "/dashboard/admin/admin-profile",
    name: "Admin Profile",
    component: AdminProfile,
    exact: true,
  },
];

export default routes;
