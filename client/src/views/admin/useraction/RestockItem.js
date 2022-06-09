import React, { useState, useContext } from "react";
import * as moment from "moment";
import axios from "axios";

import Swal from "sweetalert";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import BASE_URL from "src/base_url";

export default function Items({ restock }) {
  const token = localStorage.getItem("token");

  const [qty, setQty] = useState(10);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [shop, setShop] = useState("");
  const [createdAt, setDate] = useState("");
  const [id, setId] = useState(0);
  const [modal, setModal] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchData = async (id) => {
    console.log("just", id);
    axios
      .get(`${BASE_URL}/api/inventory/get-single-restock/${id}`, config)
      .then((response) => {
        if (response.data.success) {
          setType(response.data.restock.type);
          setQty(response.data.restock.qty);
          setDate(response.data.restock.createdAt);
          setCategory(response.data.restock.category);
          setShop(response.data.restock.shop);
          setId(response.data.restock._id);
        }
      });
  };
  const handleDelete = (id) => async () => {
    console.log(id);

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
          url: `${BASE_URL}/api/inventory/delete-user-restock/${id}`,
          headers: config.headers,
        })
          .then((response) => {
            if (response.data.success) {
              Swal(" Your record has been deleted!", {
                icon: "success",
              });
              window.location.reload();
            } else {
              Swal("Something went wrong!");
            }
          })
          .catch((e) => {
            Swal({ text: e.response.data.msg, icon: "error" });
          });
      }
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setModal(false);
    const data = { category, type, qty, createdAt };

    axios({
      method: "put",
      url: `${BASE_URL}/api/inventory/update-restock/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          Swal({
            title: "Good job!",
            text: "You have successfully updated this item.",
            icon: "success",
            button: "Ok",
          });
          setInterval(() => {
            window.location.reload();
          }, 3000);
        }
      })
      .catch((e) => {
        console.log(e.response.data);
        Swal({ text: e.response.data.msg, icon: "error" });
      });
  };

  return (
    <>
      {restock.map((invent, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{invent.qty}</td>
            <td>{invent.category}</td>
            <td>{invent.type}</td>
            <td>{invent.prize}</td>
            <td>{invent.shop}</td>
            <td>{moment(invent.createdAt).format("DD/MM/YYYY")}</td>

            <td style={{ width: "17%" }}>
              <span
                rel="tooltip"
                title="edit item"
                onClick={() => {
                  fetchData(invent._id);
                  setModal(!modal);
                }}
                className="edit-btn"
              >
                Edit
              </span>
              <span
                to="#"
                rel="tooltip"
                title="delete item"
                className="del-btn"
                onClick={handleDelete(invent._id)}
              >
                Delete
              </span>
            </td>
          </tr>
        );
      })}
      <CModal show={modal} onClose={() => setModal()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-sm-6">
              Category:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Type:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              Qty:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Shop:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={shop}
                  onChange={(e) => setShop(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              Date:
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setDate(new Date(e.target.value))}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
          </div>
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
    </>
  );
}
