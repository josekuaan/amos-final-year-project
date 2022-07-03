import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { WalletContext } from "../../../pageContext";
import Pagination from "./Pagination";
import "../../style.css";
import Items from "./Items";

import BASE_URL from "src/base_url";

export default function Log() {
  const token = localStorage.getItem("token");
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  const [startDate, setStartdate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { setUsers, users, sale, setSale } = useContext(WalletContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [salePerPage] = useState(15);
  const [agent, setAgent] = useState("");
  const [active, setActive] = useState("");
  const [loading, setloading] = useState(false);
  const [saleCopy, setSaleCopy] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    asyncCall();
  }, []);
  const asyncCall = () => {
    setloading(true);
    fetchData();
    setloading(false);
  };
  const fetchData = async () => {
    axios
      .get(`${BASE_URL}/api/user/auth/get-users`, config)
      .then(function (response) {
        if (response.data.success) {
          setUsers(response.data.msg);
        }
      });

    axios
      .get(`${BASE_URL}/api/inventory/get-sales`, config)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.sale);
          setSale(response.data.sale);
          setSaleCopy(response.data.sale);
        }
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;

    if (saleCopy.length !== 0 && value !== "") {
      let result = saleCopy.filter((item) =>
        item.category.toUpperCase().startsWith(value.toUpperCase())
      );

      setSaleCopy(result);
    } else if (value === "" && saleCopy.length <= sale.length) {
      setSaleCopy(active);
    } else if (value === "") {
      setSaleCopy(sale);
    } else {
      let result = sale.filter((item) =>
        item.category.startsWith(value.toUpperCase())
      );
      setSaleCopy(result);
    }
  };

  const indexOfLastInventory = currentPage * salePerPage;
  const indexOfFirstInventory = indexOfLastInventory - salePerPage;

  // This can be improved upon
  const currentSale =
    saleCopy != undefined
      ? saleCopy.slice(indexOfFirstInventory, indexOfLastInventory)
      : setloading(true);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoggedIn === null) {
    return <Redirect to="/" />;
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div style={{ padding: " 1.25rem" }}>
            <div className="row" style={{ marginBottom: "10px" }}>
              <div className="col-sm-3">
                <br />
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Search by title"
                    onChange={handleChange}
                    required
                  />
                  <span className="input-group-addon"></span>
                </div>
              </div>
            </div>
            <div className="row hide">
              <div className="col-sm-8"></div>
              <div className="col-sm-4">
                <input
                  value="Delete"
                  className="delete-btn"
                  onChange={handleChange}
                />
                <Link className="edit-btn" to="/dashboard/admin/credit-user">
                  <i className="fas fa-plus"></i> Edit Product
                </Link>
              </div>
            </div>
            <br />
            {sale == undefined || sale.length === 0 ? (
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
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              // </div>
              <div className=" table-responsive">
                <table
                  className="table table-bordered"
                  style={{ marginBottom: "0rem" }}
                >
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>IMAGE</th>
                      <th>TITLE</th>
                      <th>QTY</th>
                      <th>PAYMENTType</th>
                      <th>PRICE(NGN)</th>
                      <th>TOTAL(NGN)</th>
                      <th>DATE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Items loading={loading} sale={currentSale} />
                  </tbody>
                </table>
                <Pagination
                  currentSale={saleCopy.length}
                  inventoryPerPage={salePerPage}
                  totalInventory={sale === undefined ? 0 : sale.length}
                  paginate={paginate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* /.col */}
    </div>
  );
}
