import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import { WalletContext } from "../../../pageContext";

import "../../style.css";
import Items from "./Items";
import Pagination from "./Pagination";
import BASE_URL from "src/base_url";

export default function Log() {
  const token = localStorage.getItem("token");
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const { inventory, setInventory, users, setUsers } =
    useContext(WalletContext);
  const [startDate, setStartdate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agent, setAgent] = useState("");
  const [active, setActive] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryPerPage] = useState(15);
  const [currentInvent, setCurrentInvent] = useState([]);
  const [loading, setloading] = useState(false);

  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  useEffect(() => {
    setloading(true);
    fetchData();
    setloading(false);
  }, []);
  const fetchData = () => {
    axios
      .get(`${BASE_URL}/api/user/auth/get-users`, config)
      .then(function (response) {
        if (response.data.success) {
          setUsers(response.data.msg);
        }
      });
    axios
      .get(`${BASE_URL}/api/inventory/get-inventories`, config)
      .then(function (response) {
        if (response.data.success) {
          setInventory(response.data.inventory);
          setCurrentInvent(response.data.inventory);
        }
      });
  };
  const onValueChange = (e) => {
    const { value } = e.target;
    setAgent(value);
    if (value === "alluser") {
      setCurrentInvent();
      setCurrentInvent(inventory);
    } else {
      let inventoryId = inventory
        .slice()
        .filter((invent) => invent.shop === value);
      setActive(inventoryId);
      setCurrentInvent(inventoryId);
    }
  };

  const search = (e) => {
    e.preventDefault();
    axios
      .get(
        `${BASE_URL}/api/inventory/get-inventories?startdate=${startDate}&&endDate=${endDate}
        `,

        config
      )
      .then(function (response) {
        if (response.data.success) {
          setInventory(response.data.inventory);
          setCurrentInvent(response.data.inventory);
        }
      });

    if (startDate == "" && endDate == "") {
      fetchData();
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;

    if (currentInvent.length !== 0 && value !== "") {
      let result = currentInvent.filter((item) =>
        item.category.toUpperCase().startsWith(value.toUpperCase())
      );

      setCurrentInvent(result);
    } else if (agent === "alluser") {
      setCurrentInvent(inventory);
    } else if (value === "" && currentInvent.length <= inventory.length) {
      setCurrentInvent(active);
    } else {
      let result = inventory.filter((item) =>
        item.category.startsWith(value.toUpperCase())
      );
      setCurrentInvent(result);
    }
  };
  const handleTypeChange = (e) => {
    const { value } = e.target;

    let result = currentInvent.filter((item) => item.type.startsWith(value));
    if (value.length === 0) {
      setCurrentInvent(active);
    } else {
      setCurrentInvent(result);
    }
  };

  //Get currentpage

  const indexOfLastInventory = currentPage * inventoryPerPage;
  const indexOfFirstInventory = indexOfLastInventory - inventoryPerPage;

  const currentInventory = currentInvent
    ? currentInvent.slice(indexOfFirstInventory, indexOfLastInventory)
    : setloading(true);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoggedIn === null) {
    return <Redirect to="/" />;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-head-content">
              <h3 className="card-title">History</h3>

              <div className="col-sm-4 ">
                <br />
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name..."
                    onChange={handleChange}
                    required
                  />
                  <span className="input-group-addon"></span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: " 1.25rem" }}>
            {inventory === undefined || inventory.length === 0 ? (
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
                      <th>Qty</th>

                      <th>Type</th>

                      <th>Price</th>
                      <th>Thumbnail</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Items loading={loading} inventory={currentInventory} />
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              inventoryPerPage={inventoryPerPage}
              totalInventory={
                currentInvent === undefined ? 0 : currentInvent.length
              }
              inventory={currentInvent.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
      {/* /.col */}
    </div>
  );
}
