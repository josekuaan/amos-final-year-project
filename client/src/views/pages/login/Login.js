import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link, Redirect } from "react-router-dom";
import isLoggedIn from "../../../helper";
import "../../style.css";

import { WalletContext } from "../../../pageContext";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import BASE_URL from "src/base_url";

const Login = () => {
  const history = useHistory();
  const { setCurrentUser } = useContext(WalletContext);
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
  const [rememberMe] = useState(rememberMeChecked);
  const [err, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [buttonAction, setButton] = useState(false);

  const submitUser = async (userInfo) => {
    const data = {
      email: userInfo.email.toLowerCase(),
      password: userInfo.password.toLowerCase(),
    };
    console.log(data);

    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      body: JSON.stringify(data),
    };

    try {
      var response = await fetch(
        `${BASE_URL}/api/user/auth/login`,
        options
      ).then((respo) => respo.json());

      if (response.success) {
        setCurrentUser([response.user]);
        window.localStorage.setItem("userId", response.user._id);
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("token", response.token);

        setButton(true);

        if (response.user.role === "admin") {
          return history.push("/dashboard/admin/create-product");
        } else if (response.data.user.role === "user") {
          return history.push("/dashboard/user/sale");
        }
      } else if (!response.data.success) {
        setError(response.data.msg);
      } else if (rememberMe === true) {
        window.localStorage.setItem("rememberMe", response.data.user._id);
      } else {
        localStorage.removeItem("rememberMe");
      }
      // 3894
      if (isLoading) {
        setTimeout(() => {
          setLoading(!isLoading);
        }, 1000);
      }
    } catch (error) {
      if (error.response === undefined) {
        setLoading(false);
        return setError("Could not connect to the server, check your network");
      } else {
        setError(error.response.data.msg);
      }
      setLoading(false);
    }
  };

  // if (isLoggedIn) {
  //   return <Redirect to="" />;
  // }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                {err === undefined ? (
                  <div className={err > 1 ? "login-message error " : "hide"}>
                    {err}
                  </div>
                ) : err.length > 1 ? (
                  <div
                    className={err.length > 1 ? "login-message error " : "hide"}
                  >
                    {err}
                  </div>
                ) : (
                  ""
                )}
                <CCardBody>
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email("Email is invalid")
                        .required("Email is required"),
                      password: Yup.string()
                        .min(6, "Password must be at least 6 characters")
                        .required("Password is required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        let dataToSubmit = {
                          email: values.email,
                          password: values.password,
                        };
                        submitUser(dataToSubmit);
                      }, 3000);
                    }}
                  >
                    {(props) => {
                      const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset,
                      } = props;
                      return (
                        <CForm onSubmit={handleSubmit}>
                          <p
                            className="text-muted text-center"
                            style={{ fontSize: "20px", lineHeight: 3 }}
                          >
                            Sign In to your account
                          </p>
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                                <CIcon name="cil-user" />
                              </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput
                              type="email"
                              placeholder="email"
                              autoComplete="email"
                              id="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onReset={handleReset}
                              className={
                                errors.email && touched.email
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.email && touched.email && (
                              <div
                                className="input-feedback"
                                style={{ color: "red" }}
                              >
                                {errors.email}
                              </div>
                            )}
                          </CInputGroup>
                          <CInputGroup className="mb-4">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                                <CIcon name="cil-lock-locked" />
                              </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput
                              type={values.showPassword ? "text" : "password"}
                              placeholder="Password"
                              autoComplete="current-password"
                              id="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onReset={handleReset}
                              className="form-control rounded-0"
                            />
                            {errors.password && touched.password && (
                              <div
                                className="input-feedback"
                                style={{ color: "red" }}
                              >
                                {errors.password}
                              </div>
                            )}
                          </CInputGroup>
                          <CRow>
                            <CCol xs="12">
                              <CButton
                                color="primary"
                                className="px-4"
                                type="submit"
                                style={{
                                  width: "100% ",
                                  fontSize: "18px ",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => setLoading(!isLoading)}
                                disabled={buttonAction}
                              >
                                {isLoading ? "Loading" : "Login"}
                              </CButton>
                              <br />
                              <div style={{ textAlign: "center" }}>
                                <Link
                                  to="/forggotten-password"
                                  className="px-0"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                            </CCol>
                          </CRow>
                        </CForm>
                      );
                    }}
                  </Formik>
                </CCardBody>
              </CCard>
              {/* <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      To make an transaction with us simply login to your
                      account or Contact the admin to create account for you.
                    </p>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
