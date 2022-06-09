import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import TheAdminLayout from "./containers/TheAdminLayout";
import TheLayout from "./containers/TheLayout";

class Layout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div>
          <Switch>
            <Route
              path="/dashboard/user/sale"
              name="Dashboard"
              render={(props) => <TheLayout {...props} />}
            />
            <Route
              path="/dashboard/admin"
              name="Admin"
              render={(props) => <TheAdminLayout {...props} />}
            />
          </Switch>
        </div>
      </>
    );
  }
}

export default Layout;
