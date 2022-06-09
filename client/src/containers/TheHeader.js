import React from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/icons/logo.png";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CSubheader,
  CBreadcrumbRouter,
} from "@coreui/react";

import "./style.css";
// routes config
import routes from "../routes";

import { TheHeaderDropdown } from "./index";

const TheHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <div
        className="c-header"
        style={{ backgroundColor: "#1d2330", width: "100%" }}
      >
        <CToggler
          inHeader
          className="ml-md-3 d-lg-none first"
          style={{
            minWidth: "30px",
            height: "30px",
            marginTop: "12px",
            marginLeft: "12px",
            backgroundColor: "white",
          }}
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          className="ml-3 d-md-down-none second"
          style={{
            minWidth: "30px",
            height: "30px",
            marginTop: "12px",
            backgroundColor: "white",
          }}
          onClick={toggleSidebar}
        />
        <CHeaderBrand className="mx-auto d-lg-none" to="#">
          {/* <CIcon name="logo" height="48" alt="Logo" /> */}
          <img
            src={logo}
            alt="logo"
            className="c-sidebar-brand-full"
            height={35}
          />
        </CHeaderBrand>

        <CHeaderNav className="d-md-down-none mr-auto">
          <CHeaderNavItem className="px-3"></CHeaderNavItem>
        </CHeaderNav>

        <CHeaderNav className="px-3">
          <TheHeaderDropdown />
        </CHeaderNav>
      </div>
      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
      </CSubheader>
    </CHeader>
  );
};

export default TheHeader;
