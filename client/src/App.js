import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import { DataProvider } from "./pageContext";

import Layout from "./Layout";
import Login from "./views/pages/login/Login";
import ResetPassword from "./views/pages/resetpassword/ResetPassword";
import Register from "./views/pages/register/Register";
import ForggottenPage from "./views/pages/forggotpassword/ForggotPassword";
import Page500 from "./views/pages/page500/Page500";
import Page404 from "./views/pages/page404/Page404";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <BrowserRouter>
          <DataProvider>
            <Switch>
              <Route
                exact
                path="/"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/forggotten-password"
                name="ForggottenPage Page"
                render={(props) => <ForggottenPage {...props} />}
              />
              <Route
                exact
                path="/reset-password/:id"
                name="Reset Password Page"
                render={(props) => <ResetPassword {...props} />}
              />

              <Route
                exact
                path="/404"
                name="Page 404"
                render={(props) => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={(props) => <Page500 {...props} />}
              />
              <Route
                path="/dashboard"
                render={(props) => <Layout {...props} />}
              />
            </Switch>
          </DataProvider>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
