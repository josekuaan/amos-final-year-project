import React, { useContext, useState } from "react";
import * as moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert";
import { WalletContext } from "../../../pageContext";
import BASE_URL from "src/base_url";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

export default function Items({ loading, sale }) {
  const { setSale } = useContext(WalletContext);
  const token = localStorage.getItem("token");
  const [prize, setPrize] = useState(20);
  const [qty, setQty] = useState(10);
  const [type, setType] = useState("type");
  const [category, setCategory] = useState("welding");
  const [payment, setPayment] = useState("cash");
  const [detail, setDetails] = useState("");
  const [createdAt, setDate] = useState("");
  const [time, setTime] = useState("");
  const [shop, setShop] = useState("");
  const [id, setId] = useState(0);
  const [modal, setModal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${token}`,
    },
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
          url: `${BASE_URL}/api/inventory/delete-user-sale/${id}`,
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

          .catch((e) => {
            Swal({ text: e.response.data.msg, icon: "error" });
          });
      }
    });
  };

  const fetchData = async (id) => {
    axios
      .get(`${BASE_URL}/api/inventory/get-sale-id/${id}`, config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setType(response.data.sale.type);
          setQty(response.data.sale.qty);
          setPrize(response.data.sale.prize);
          setCategory(response.data.sale.category);
          setPayment(response.data.sale.payment);
          setId(response.data.sale._id);
          setTime(response.data.sale.createdAt);
          setShop(response.data.sale.shop);
          setDetails(response.data.sale.detail);
        }
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setModal(false);
    console.log(createdAt);
    const data = { category, type, qty, prize, payment, createdAt };

    axios({
      method: "put",
      url: `${BASE_URL}/api/inventory/update-sale/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setSale(response.data.sale);
          Swal({
            title: "Good job!",
            text: "You have successfully updated this item.",
            icon: "success",
            button: <But />,
          });
          setInterval(() => {
            window.location.reload();
          }, 3000);
        }
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: "error" });
      });
  };
  if (loading) {
    return <h2>loading...</h2>;
  }
  if (sale.length === 0) {
    return (
      <tr style={{ padding: "1rem", textAlign: "center" }}>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>

        <td style={{ border: "none" }}>No Sales Found</td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
      </tr>
    );
  }

  return (
    <>
      {sale.map((invent, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{invent.qty}</td>
            <td>{invent.category}</td>
            <td>{invent.type}</td>
            <td>{invent.payment}</td>
            <td>{invent.prize}</td>
            <td>
              {" "}
              {`NGN${
                invent.qty === 0.5
                  ? invent.prize * parseInt(invent.qty.toFixed())
                  : invent.prize * invent.qty
              }`}
            </td>
            <td>{invent.date}</td>

            <td style={{ width: "17%" }}>
              <span
                rel="tooltip"
                title="view item"
                onClick={() => {
                  fetchData(invent.id);
                  setModalView(!modalView);
                }}
                className="view-btn"
              >
                View
              </span>
              <span
                rel="tooltip"
                title="edit item"
                onClick={() => {
                  fetchData(invent.id);
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
                onClick={handleDelete(invent.id)}
              >
                Delete
              </span>
            </td>
          </tr>
        );
      })}
      <CModal show={modalView} onClose={() => setModalView()}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Item</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-sm-6">
              <div>Qty: {qty}</div>
              <div>Category: {category.toUpperCase()}</div>
              <div>Type: {type.toUpperCase()}</div>
              <div>price: {prize}</div>
              <div>Date: {moment(time).format("MMMM Do YYYY, h:mm:ss a")}</div>
              <div>Payment: {payment.toUpperCase()}</div>
              <div>Shop: {shop}</div>
              <div>Details: {detail.toUpperCase()}</div>
            </div>
          </div>
        </CModalBody>
      </CModal>
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
              Price:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Payment Type:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value.toLowerCase())}
                  required
                />
                <span className="input-group-addon"></span>
              </div>
            </div>
            <div className="col-sm-6">
              Set Date:
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  required
                  onChange={(e) => setDate(new Date(e.target.value))}
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
function But() {
  <Link onClick={() => window.location.reload()}>OK</Link>;
}
