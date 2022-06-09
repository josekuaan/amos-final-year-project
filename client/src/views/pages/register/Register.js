import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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

const Register = () => {
  const history = useHistory();

  const [err, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const submitUser = async (userInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };
    const data = {
      fullName: userInfo.fullName,
      email: userInfo.email,
      shop: userInfo.shop,
      password: userInfo.password,
    };
    console.log(data);
    axios
      .post(`${BASE_URL}/api/user/auth/register`, data, config)
      .then(function (response) {
        if (response.data.success) {
          return history.push("/");
        }
        if (isLoading) {
          setTimeout(() => {
            setLoading(!isLoading);
          }, 1000);
        }
      })
      .catch(function (error) {
        if (error.response === undefined) {
          setLoading(false);
          return setError(
            "Could not connect to the server, check your network"
          );
        } else {
          setError(error.response.data.msg);
        }
        setLoading(false);
      });
    if (isLoading) {
      setTimeout(() => {
        setLoading(!isLoading);
      }, 1000);
    }
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              {err.length > 1 ? (
                <div
                  className={err.length > 1 ? "login-message error " : "hide"}
                >
                  {err}
                </div>
              ) : (
                ""
              )}
              <CCardBody className="p-4">
                <Formik
                  initialValues={{
                    email: "",
                    fullName: "",
                    shop: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={Yup.object().shape({
                    fullName: Yup.string().required("Full Name is required"),
                    shop: Yup.string().required("Shop is required"),

                    email: Yup.string()
                      .email("Email is invalid")
                      .required("Email is required"),

                    password: Yup.string()
                      .min(6, "Password must be at least 6 characters")
                      .required("Password is required"),
                    confirmPassword: Yup.string()
                      .oneOf(
                        [Yup.ref("password"), null],
                        "Passwords must match"
                      )
                      .required("Confirm Password is required"),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      let dataToSubmit = {
                        email: values.email,
                        password: values.password,
                        fullName: values.fullName,
                        shop: values.shop,
                      };
                      console.log(dataToSubmit);
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
                        <h1>Register</h1>
                        <p className="text-muted">Create your account</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-user" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="text"
                            placeholder="Full Name"
                            autoComplete="fullName"
                            name="fullName"
                            value={values.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onReset={handleReset}
                            className={
                              errors.fullName && touched.fullName
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.fullName && touched.fullName && (
                            <div
                              className="input-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.fullName}
                            </div>
                          )}
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>@</CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="text"
                            placeholder="Email"
                            autoComplete="email"
                            name="email"
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
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onReset={handleReset}
                            className={
                              errors.password && touched.password
                                ? "form-control error"
                                : "form-control"
                            }
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
                        <CInputGroup className="mb-4">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput
                            type="password"
                            placeholder="Repeat password"
                            autoComplete="new-password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onReset={handleReset}
                            className={
                              errors.confirmPassword && touched.confirmPassword
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.confirmPassword && touched.confirmPassword && (
                            <div
                              className="input-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.confirmPassword}
                            </div>
                          )}
                        </CInputGroup>
                        <CButton
                          color="success"
                          type="submit"
                          block
                          onClick={() => setLoading(!isLoading)}
                        >
                          {isLoading ? "Creating" : "Create Account"}
                        </CButton>
                      </CForm>
                    );
                  }}
                </Formik>
              </CCardBody>
              <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    Already have an account?<Link to="/login">login</Link>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
