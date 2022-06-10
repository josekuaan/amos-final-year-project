import React from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/icons/logo.png";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import "../views/style.css";
// sidebar nav config c-sidebar-nav-item
import navigation from "./admin_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      show={show}
      style={{
        color: "#3c4b64",
        backgroundColor: "#fff",
      }}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <div>
        <CSidebarBrand
          className="d-md-down"
          to="/dashboard/admin/create-product"
          style={{
            padding: "20px",
            justifyContent: "left",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="c-sidebar-brand-full"
            // height={45}
          />
        </CSidebarBrand>
      </div>
      <CSidebarNav
        style={{
          color: "#3c4b64",
        }}
      >
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
