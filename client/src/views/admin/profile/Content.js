import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

import Swal from "sweetalert";
import {
  CButton,
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import "../../style.css";
import { WalletContext } from "../../../pageContext";
import BASE_URL from "src/base_url";
import ModalForm from "./ModalForm";

export default function Content() {
  const token = localStorage.getItem("token");
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const { setUsers, users } = useContext(WalletContext);

  const [email, setEmail] = useState("");
  const [fullName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(async () => {
    fetchData();
  }, []);
  const fetchData = async () => {
    axios
      .get(`${BASE_URL}/api/user/auth/get-users`, config)
      .then(function (response) {
        if (response.data.success) {
          setUsers(response.data.msg);
        }
      });
  };

  const submitUser = async (userInfo) => {
    const data = {
      fullName: userInfo.fullName.toLowerCase(),
      email: userInfo.email.toLowerCase(),
      shop: userInfo.shop.toLowerCase(),
      password: userInfo.password.toLowerCase(),
    };

    axios
      .post(`${BASE_URL}/api/user/auth/register`, data, config)
      .then(function (response) {
        if (response.data.success) {
          Swal({
            title: "Good job!",
            text: "User created successfully",
            icon: "success",
            button: "Ok",
          });
          setUsers([...users, response.data.user]);
          setLoading(false);
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
          return setErr("Could not connect to the server, check your network");
        } else if (error.response.data === undefined) {
          return setErr("Could not connect to the server, check your network");
        } else {
          Swal({
            title: "Sorry!",
            text: error.response.data.msg,
            icon: "error",
          });
        }
        setLoading(false);
      });

    if (isLoading) {
      setTimeout(() => {
        setLoading(!isLoading);
      }, 1000);
    }
  };
  const fetchSingleUser = async (id) => {
    console.log("just", id);
    axios
      .get(`${BASE_URL}/api/user/auth/get-user/${id}`, config)
      .then((response) => {
        if (response.data.success) {
          setUserName(response.data.msg.fullName);
          setEmail(response.data.msg.email);
          setId(response.data.msg._id);
        }
      });
  };
  const handleDelete = (id) => async () => {
    Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios({
          method: "delete",
          url: `${BASE_URL}/api/user/auth/delete-user/${id}`,
          headers: config.headers,
        })
          .then((response) => {
            if (response.data.success) {
              Swal(" Your record has been deleted!", {
                icon: "success",
              });
              setInterval(() => {
                window.location.reload();
              }, 3000);
            } else {
              Swal("Something went wrong!");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setModal(false);
    const data = { email, fullName, password };

    axios({
      method: "put",
      url: `${BASE_URL}/api/user/auth/update-user/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          if (response.data.password) {
            return Swal({
              title: "Good job!",
              text: response.data.msg,
              icon: "success",
              button: "Ok",
            });
          } else {
            Swal({
              title: "Good job!",
              text: "You have successfully updated this user.",
              icon: "success",
              button: "Ok",
            });
          }
        }
        setInterval(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: "error" });
      });
  };
  if (isLoggedIn === null) {
    return <Redirect to="/" />;
  }
  return (
    <div className="body-content center">
      <center>
        <div className="row">
          <div className="col-md-12">
            <CCard className="mx-6">
              <CTabs>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink>Create User</CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>Users</CNavLink>
                  </CNavItem>
                </CNav>

                <CTabContent>
                  <CTabPane>
                    {err.length > 1 ? (
                      <div
                        className={
                          err.length > 1 ? "login-message error " : "hide"
                        }
                      >
                        {err}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="col-sm-6 col-md-6">
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
                            fullName: Yup.string().required(
                              "Full Name is required"
                            ),
                            shop: Yup.string().required(
                              "Shop Name is required"
                            ),

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
                            setLoading(true);
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
                                <h1 className="form-title">
                                  Create user account
                                </h1>

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
                                    <CInputGroupText>
                                      <CIcon name="cil-home" />
                                    </CInputGroupText>
                                  </CInputGroupPrepend>
                                  <CInput
                                    type="text"
                                    placeholder="Shop Name"
                                    autoComplete="shop"
                                    name="shop"
                                    value={values.shop}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onReset={handleReset}
                                    className={
                                      errors.shop && touched.shop
                                        ? "form-control error"
                                        : "form-control"
                                    }
                                  />
                                  {errors.shop && touched.shop && (
                                    <div
                                      className="input-feedback"
                                      style={{ color: "red" }}
                                    >
                                      {errors.shop}
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
                                      errors.confirmPassword &&
                                      touched.confirmPassword
                                        ? "form-control error"
                                        : "form-control"
                                    }
                                  />
                                  {errors.confirmPassword &&
                                    touched.confirmPassword && (
                                      <div
                                        className="input-feedback"
                                        style={{ color: "red" }}
                                      >
                                        {errors.confirmPassword}
                                      </div>
                                    )}
                                </CInputGroup>
                                <CButton
                                  style={{
                                    background: "rgb(60, 75, 100)",
                                    letterSpacing: "1px",
                                    fontSize: "16px",
                                    color: "#fff",
                                  }}
                                  type="submit"
                                  block
                                >
                                  {isLoading ? "Creating" : "Create Account"}
                                </CButton>
                              </CForm>
                            );
                          }}
                        </Formik>
                      </CCardBody>
                    </div>
                  </CTabPane>

                  <CTabPane>
                    {
                      (users.reverse(),
                      users.length === 0 ? (
                        ""
                      ) : (
                        <div className="col-sm-8 col-md-8">
                          {users.map((user, index) => {
                            return (
                              <div key={index}>
                                <div className="work-progress">
                                  <span>User Name</span>
                                  <span style={{ textTransform: "capitalize" }}>
                                    {user.fullName}
                                  </span>
                                </div>
                                <div className="work-progress">
                                  <span>Shop Name</span>
                                  <span style={{ textTransform: "capitalize" }}>
                                    {user.shop ? user.shop : "No shop assigned"}
                                  </span>
                                </div>
                                <div className="work-progress">
                                  <span>Email Address</span>
                                  <Link to="..">{user.email}</Link>
                                </div>
                                <div
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "1rem",
                                  }}
                                >
                                  <span
                                    style={{ padding: "4px 15px" }}
                                    rel="tooltip"
                                    title="edit item"
                                    onClick={() => {
                                      fetchSingleUser(user._id);
                                      setModal(!modal);
                                    }}
                                    className="edit-btn"
                                  >
                                    Edit
                                  </span>
                                  <span
                                    style={{ padding: "4px 12px" }}
                                    rel="tooltip"
                                    title="delete item"
                                    className="del-btn"
                                    onClick={handleDelete(user._id)}
                                  >
                                    Delete
                                  </span>
                                </div>
                                <hr />
                              </div>
                            );
                          })}
                        </div>
                      ))
                    }
                  </CTabPane>
                </CTabContent>
              </CTabs>
              <CModal show={modal} onClose={() => setModal()}>
                <CModalHeader closeButton>
                  <CModalTitle>Edit User</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <ModalForm
                    username={fullName}
                    email={email}
                    setUserName={setUserName}
                    setEmail={setEmail}
                    setPassword={setPassword}
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary" onClick={handleSubmit}>
                    Edit
                  </CButton>{" "}
                  <CButton color="secondary" onClick={() => setModal(false)}>
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCard>
          </div>
        </div>
      </center>
    </div>
  );
}
