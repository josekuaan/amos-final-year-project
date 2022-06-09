import React from "react";

import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

const TheHeaderAdminDropdown = () => {
  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <div className="profile-background">
            <i
              className="fa fa-user"
              style={{ padding: "12px", fontSize: "10px" }}
            ></i>
          </div>
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem to="/dashboard/admin/admin-profile">
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderAdminDropdown;
