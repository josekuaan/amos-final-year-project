import React from "react";
import {
  TheAdminContent,
  TheAdminSidebar,
  TheFooter,
  TheAdminHeader,
} from "./admin_index";

const TheAdminLayout = () => {
  return (
    <div className="c-app c-default-layout">
      <TheAdminSidebar />
      <div className="c-wrapper">
        <TheAdminHeader />
        <div className="c-body">
          <TheAdminContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheAdminLayout;
