import React from "react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Make A Sale",
    to: "/dashboard/user/sale",
    icon: (
      <i
        className="fa fa-credit-card c-sidebar-nav-icon"
        style={{ fontSize: "27px" }}
      ></i>
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "History",
    to: "/dashboard/user/sale/log",
    icon: (
      <i
        className="fas fa-history c-sidebar-nav-icon"
        style={{ fontSize: "27px" }}
      ></i>
    ),
  },
];

export default _nav;
