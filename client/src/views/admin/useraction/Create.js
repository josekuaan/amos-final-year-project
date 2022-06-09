import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import axios from "axios";
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import Swal from "sweetalert";
import "../../style.css";
import { WalletContext } from "../../../pageContext";
import BASE_URL from "src/base_url";
import Modal from "./modal";

export default function Credit() {
  const { categories, users, setCategory, setUsers } =
    useContext(WalletContext);
  const token = localStorage.getItem("token");

  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const [prize, setPrize] = useState("");
  const [title, setTitle] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState();

  // const [otherLevel, setOtherlevel] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  function handleChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => setFile(reader.result);
  }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    var data = JSON.stringify({
      file,
      qty,
      type,
      prize,
      title,
    });
    axios({
      method: "post",
      url: `${BASE_URL}/api/inventory/create-inventory`,
      data,
      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setLoading(false);
          Swal({
            title: "Good job!",
            text: "You have successfully created this product.",
            icon: "success",
            button: <But />,
          });
        } else {
        }
      })
      .catch((e) => {
        setLoading(false);
        Swal({ text: e.response.data.msg, icon: "error" });
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
              {/* <CNav variant="tabs">
                <CNavItem>
                  <CNavLink> Inventory</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>Category</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>Type</CNavLink>
                </CNavItem>
              </CNav> */}
              <CTabContent>
                <CTabPane>
                  {/* <div className="card-header">
                    <div className="card-head-content">
                      <h3 className="card-title">History</h3>

                      <span
                        className="create-btn"
                        onClick={() => setModal(!modal)}
                      >
                        Add Category
                      </span>
                    </div>
                  </div> */}
                  <div className="card-content">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <div className="row" style={{ padding: "20px 0" }}>
                          {/* <div style={{marginBottom:"10px"}}>Front View</div> */}
                          <div className="col-sm-6">
                            <div style={{ marginBottom: "10px" }}>Title</div>
                            <div className="input-group">
                              <input
                                type="text"
                                placeholder="title"
                                className="form-control"
                                onChange={(e) => setTitle(e.target.value)}
                                required
                              />
                              <span className="input-group-addon"></span>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div style={{ marginBottom: "10px" }}>
                              New or Featured
                            </div>
                            <div className="input-group">
                              <select
                                className="form-control"
                                required
                                onChange={(e) =>
                                  setType(e.target.value.toLowerCase())
                                }
                              >
                                <option value="">Please select</option>
                                {["new", "featured"].map((category, index) => (
                                  <option key={index} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-6">
                            <div style={{ marginBottom: "10px" }}>Quantity</div>
                            <div className="input-group">
                              <input
                                type="number"
                                placeholder="quantity"
                                className="form-control"
                                onChange={(e) => setQty(e.target.value)}
                                required
                              />
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div style={{ marginBottom: "10px" }}>Prize </div>
                            <div className="input-group">
                              <input
                                type="number"
                                placeholder="price"
                                className="form-control"
                                onChange={(e) => setPrize(e.target.value)}
                                required
                              />
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                        </div>
                        <div className="row" style={{ marginTop: "30px" }}>
                          <div className="col-sm-6">
                            {/* <div>Re-order Limit</div> */}
                            <div className="input-group">
                              <input type="file" onChange={handleChange} />

                              {/* <input
                              type="number"
                              placeholder="re-order"
                              className="form-control"
                             
                              required
                            /> */}
                              <span className="input-group-addon"></span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            {file === undefined ? (
                              <div></div>
                            ) : (
                              <img src={file} alt="upload" width={100} />
                            )}
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
                            padding: "7px",
                            cursor: "pointer",
                          }}
                          type="submit"
                          value={isLoading ? "Creating..." : "Create"}
                        />
                      </div>
                    </form>
                  </div>
                </CTabPane>
              </CTabContent>
            </CTabs>
            <Modal
              modal={modal}
              setModal={setModal}
              setCategory={setCategory}
            />

            {/* end card */}
          </div>
        </div>
      </div>
    </div>
  );
}

function But() {
  <Link onClick={() => window.location.reload()}>OK</Link>;
}
