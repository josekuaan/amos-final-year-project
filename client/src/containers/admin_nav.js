import React from "react";

const admin_nav = [
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Dashboard",
  //   to: "/dashboard/admin",
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 512 512"
  //       className="c-icon c-icon-2xl c-sidebar-nav-icon"
  //       role="img"
  //     >
  //       <path
  //         fill="var(--ci-primary-color, currentColor)"
  //         d="M425.706,142.294A240,240,0,0,0,16,312v88H160V368H48V312c0-114.691,93.309-208,208-208s208,93.309,208,208v56H352v32H496V312A238.432,238.432,0,0,0,425.706,142.294Z"
  //         className="ci-primary"
  //       ></path>
  //       <rect
  //         width="32"
  //         height="32"
  //         x="80"
  //         y="264"
  //         fill="var(--ci-primary-color, currentColor)"
  //         className="ci-primary"
  //       ></rect>
  //       <rect
  //         width="32"
  //         height="32"
  //         x="240"
  //         y="128"
  //         fill="var(--ci-primary-color, currentColor)"
  //         className="ci-primary"
  //       ></rect>
  //       <rect
  //         width="32"
  //         height="32"
  //         x="136"
  //         y="168"
  //         fill="var(--ci-primary-color, currentColor)"
  //         className="ci-primary"
  //       ></rect>
  //       <rect
  //         width="32"
  //         height="32"
  //         x="400"
  //         y="264"
  //         fill="var(--ci-primary-color, currentColor)"
  //         className="ci-primary"
  //       ></rect>
  //       <path
  //         fill="var(--ci-primary-color, currentColor)"
  //         d="M297.222,335.1l69.2-144.173-28.85-13.848L268.389,321.214A64.141,64.141,0,1,0,297.222,335.1ZM256,416a32,32,0,1,1,32-32A32.036,32.036,0,0,1,256,416Z"
  //         className="ci-primary "
  //       ></path>
  //     </svg>
  //   ),
  // },
  {
    _tag: "CSidebarNavItem",
    name: "Create Product",
    to: "/dashboard/admin/create-product",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="c-icon c-icon-2xl c-sidebar-nav-icon"
        role="img"
      >
        <path
          fill="var(--ci-primary-color, currentColor)"
          d="M496,144.768V111.232H456.768V42a25,25,0,0,0-25.179-24.768H80.411A25,25,0,0,0,55.232,42V472a25,25,0,0,0,25.179,24.768H431.589A25,25,0,0,0,456.768,472V400.768H496V367.232H456.768V272.768H496V239.232H456.768V144.768Zm-72.768,94.464H376v33.536h47.232v94.464H376v33.536h47.232v62.464H88.768V50.768H423.232v60.464H376v33.536h47.232Z"
          className="ci-primary"
        ></path>
        <path
          fill="var(--ci-primary-color, currentColor)"
          d="M313.639,306.925h0l-28.745-18.685,13.82-33.655V201.714a65.714,65.714,0,1,0-131.428,0v52.557l12.721,34.684-27.646,17.97A48.972,48.972,0,0,0,130,348.129V400H336V348.129A48.972,48.972,0,0,0,313.639,306.925ZM304,368H162V348.129a17.084,17.084,0,0,1,7.8-14.373l49.033-31.872-19.547-53.3V201.714a33.714,33.714,0,0,1,67.428,0v46.557l-21.5,52.347L296.2,333.756h0a17.084,17.084,0,0,1,7.8,14.373Z"
          className="ci-primary"
        ></path>
      </svg>
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Product Grid",
    to: "/dashboard/admin/product-catlog",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="c-icon c-icon-2xl c-sidebar-nav-icon"
        role="img"
      >
        <path
          fill="var(--ci-primary-color, currentColor)"
          d="M208,16A112.127,112.127,0,0,0,96,128v79.681a80.236,80.236,0,0,0,9.768,38.308l27.455,50.333L60.4,343.656A79.725,79.725,0,0,0,24,410.732V496H312V464H56V410.732a47.836,47.836,0,0,1,21.841-40.246l97.66-63.479-41.64-76.341A48.146,48.146,0,0,1,128,207.681V128a80,80,0,0,1,160,0v79.681a48.146,48.146,0,0,1-5.861,22.985L240.5,307.007,312,353.483V315.317l-29.223-19,27.455-50.334A80.23,80.23,0,0,0,320,207.681V128A112.127,112.127,0,0,0,208,16Z"
          className="ci-primary"
        ></path>
        <polygon
          fill="var(--ci-primary-color, currentColor)"
          points="424 400 424 336 392 336 392 400 328 400 328 432 392 432 392 496 424 496 424 432 488 432 488 400 424 400"
          className="ci-primary"
        ></polygon>
      </svg>
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sales",
    to: "/dashboard/admin/sales-log",
    icon: (
      <i
        className="fas fa-chart-line c-sidebar-nav-icon"
        style={{ fontSize: "27px" }}
      ></i>
    ),
  },

  {
    _tag: "CSidebarNavItem",
    name: "Restock Items",
    to: "/dashboard/admin/restock",
    icon: (
      <i
        className="fa fa-indent c-sidebar-nav-icon"
        style={{ fontSize: "27px" }}
      ></i>
    ),
  },
];

export default admin_nav;
