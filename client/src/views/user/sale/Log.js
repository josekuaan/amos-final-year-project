import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { WalletContext } from "../../../pageContext";
import Pagination from "../../admin/useraction/Pagination";

import "../../style.css";
import Items from "./Items";
import BASE_URL from "src/base_url";

export default function Log() {
  const token = localStorage.getItem("token");
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const id = window.localStorage.getItem("userId");
  const { sale, setSale } = useContext(WalletContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [salePerPage] = useState(15);
  const [loading, setloading] = useState(false);

  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  useEffect(async () => {
    fetchData();
  }, []);
  const fetchData = async () => {
    console.log("ok");
    axios
      .get(`${BASE_URL}/api/inventory/get-sales-by-user/${id}`, config)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.sale);
          setSale(response.data.sale);
        }
      });
  };
  const indexOfLastInventory = currentPage * salePerPage;
  const indexOfFirstInventory = indexOfLastInventory - salePerPage;

  // This can be improved upon
  const currentSale =
    sale != undefined
      ? sale.slice(indexOfFirstInventory, indexOfLastInventory)
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
              <Link className="create-btn" to="/dashboard/user/sale">
                <i className="fas fa-shopping-cart "></i> Add to cart
              </Link>
            </div>
          </div>
          <br />
          <br />

          <div style={{ padding: " 1.25rem" }}>
            {sale === undefined || sale.length === 0 ? (
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
                      <Link to="/dashboard/user/sale">Add to cart</Link>
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
                      <th>QTY</th>
                      <th>CATEGORY</th>
                      <th>TYPE</th>
                      <th>Payment</th>
                      <th>PRICE</th>
                      <th>TOTAL</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Items loading={loading} sale={currentSale} />
                  </tbody>
                </table>
              </div>
            )}
            <Pagination
              inventoryPerPage={salePerPage}
              totalInventory={sale === undefined ? 0 : sale.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
      {/* /.col */}
    </div>
  );
}
