import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import axios from "axios";

import Swal from "sweetalert";
import "../../style.css";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import { WalletContext } from "../../../pageContext";
import BASE_URL from "src/base_url";
import ReturnItem from "./ReturnItem";

export default function Credit() {
  const { categories, setCategory, setUsers, users, Returned, setReturn } =
    useContext(WalletContext);
  const token = localStorage.getItem("token");

  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const [prize, setPrize] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");
  const [category, setCat] = useState("");
  const [shop, setShop] = useState("");
  const [sub_categories, setSubCategory] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    axios
      .get(`${BASE_URL}/api/inventory/get-categories`, config)
      .then((response) => {
        if (response.data.success) {
          setCategory(response.data.categories);
        }
      });
    axios
      .get(`${BASE_URL}/api/inventory/get-returns`, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setReturn(response.data.returns);
        }
      });
    axios
      .get(`${BASE_URL}/api/user/auth/get-users`, config)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.msg);
          setUsers(response.data.msg);
        }
      });
  };
  const onValueChange = (e) => {
    const { value } = e.target;
    const data = { category: value };

    setCat(value.toLowerCase());

    axios({
      method: "post",
      url: `${BASE_URL}/api/inventory/get-sub-category`,
      data,
      headers: config.headers,
    }).then(function (response) {
      if (response.data.success) {
        setSubCategory(response.data.sub_categories);
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = { category, qty, type, prize, shop };

    axios({
      method: "post",
      url: `${BASE_URL}/api/inventory/return-inventory`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setLoading(false);
          setReturn(response.data.inventory);
          Swal({
            title: "Good job!",
            text: "This item has been returned.",
            icon: "success",
            button: <But />,
          });
        }
      })
      .catch((e) => {
        setLoading(false);

        Swal({ text: e.response.msg, icon: "error" });
      });
  };
  if (isLoggedIn === null) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <CTabs>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink> Return Item</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>Display</CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane>
                  <div className="card-content">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <div className="row" style={{ padding: "40px 0" }}>
                          <div className="col-sm-4">
                            <div style={{ marginBottom: "10px" }}>Category</div>
                            <div className="input-group">
                              <select
                                className="form-control"
                                required
                                onChange={onValueChange}
                              >
                                <option value="">Please select</option>
                                {categories.map((cate, index) => {
                                  return (
                                    <option key={index} value={cate.category}>
                                      {cate.category}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="input-group-addon"></span>
                            </div>
                          </div>

                          <div className="col-sm-4">
                            <div style={{ marginBottom: "10px" }}>Type</div>
                            <div className="input-group">
                              <select
                                className="form-control"
                                required
                                onChange={(e) =>
                                  setType(e.target.value.toLowerCase())
                                }
                              >
                                <option value="">Please select</option>
                                {sub_categories.map((category, index) => {
                                  return category.type.map((item, index) => {
                                    return (
                                      <option key={index} value={item}>
                                        {item}
                                      </option>
                                    );
                                  });
                                })}
                              </select>
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div style={{ marginBottom: "10px" }}>Shop</div>
                            <div className="input-group">
                              <select
                                className="form-control"
                                required
                                onChange={(e) => setShop(e.target.value)}
                              >
                                <option value="">Please select</option>
                                {users.map((user, index) => {
                                  return (
                                    <option key={index} value={user.shop}>
                                      {user.shop}
                                    </option>
                                  );
                                })}
                              </select>

                              <span className="input-group-addon"></span>
                            </div>
                          </div>

                          <div className="col-sm-4">
                            <div style={{ marginBottom: "10px" }}>Quantity</div>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="quantity"
                                onChange={(e) => setQty(e.target.value)}
                                required
                              />
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div style={{ marginBottom: "10px" }}>Price </div>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="price"
                                onChange={(e) => setPrize(e.target.value)}
                                required
                              />
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="__edit-btn-container">
                        <input
                          className={`update fill `}
                          style={{
                            borderRadius: 2,
                            border: "none",
                            color: "#fff",

                            cursor: "pointer",
                          }}
                          type="submit"
                          value={isLoading ? "Returning Item" : "Return Item"}
                        />
                      </div>
                    </form>
                  </div>
                </CTabPane>
                <CTabPane>
                  {Returned === undefined || Returned.length === 0 ? (
                    // <div className=" table-responsive">
                    <table
                      className="table table-bordered"
                      style={{ marginBottom: "0rem" }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            <p style={{ textAlign: "center" }}>
                              You Don't have any Transaction yet
                            </p>
                            <Link to="/dashboard/admin/create-product">
                              Create product
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className=" table-responsive">
                      <table
                        className="table table-bordered"
                        style={{ marginBottom: "0rem" }}
                      >
                        <thead>
                          <tr>
                            <th>S/N</th>
                            <th>QTY</th>
                            <th>CATEGORY</th>
                            <th>TYPE</th>

                            <th>PRICE</th>
                            <th>SHOP</th>
                            <th>DATE</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          <ReturnItem Returned={Returned} />
                        </tbody>
                      </table>
                    </div>
                  )}
                </CTabPane>
              </CTabContent>
            </CTabs>
          </div>{" "}
          {/* end card */}
        </div>
      </div>
    </div>
  );
}

function But() {
  <Link onClick={() => window.location.reload()}>OK</Link>;
}
