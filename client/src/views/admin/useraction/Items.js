import React, { useContext, useState } from "react";
import * as moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert";
import { Image, Transformation } from "cloudinary-react";
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

export default function Items({ loading, inventory }) {
  const { setInventory } = useContext(WalletContext);
  const token = localStorage.getItem("token");
  const [prize, setPrize] = useState(20);
  const [qty, setQty] = useState(10);
  const [type, setType] = useState("type");
  const [title, setTitle] = useState("");
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
          url: `${BASE_URL}/api/inventory/delete-user-inventory/${id}`,
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

  const fetchData = async (id) => {
    console.log("just", id);
    axios
      .get(`${BASE_URL}/api/inventory/get-single-inventory/${id}`, config)
      .then((response) => {
        if (response.data.success) {
          setType(response.data.inventory.type);
          setQty(response.data.inventory.qty);
          setPrize(response.data.inventory.prize);
          setTitle(response.data.inventory.title);

          setId(response.data.inventory._id);
        }
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setModal(false);

    const data = { title, type, qty, prize };

    axios({
      method: "put",
      url: `${BASE_URL}/api/inventory/update-inventory/${id}`,
      data,

      headers: config.headers,
    })
      .then(function (response) {
        if (response.data.success) {
          setInventory(response.data.inventory);
          Swal({
            title: "Good job!",
            text: "You have successfully updated this item.",
            icon: "success",
            button: <But />,
          });
          window.location.reload();
        }
      })
      .catch((e) => {
        Swal({ text: e.response.data.msg, icon: "error" });
      });
  };
  if (loading) {
    return <h2>loading...</h2>;
  }

  if (inventory.length === 0) {
    return (
      <tr style={{ padding: "1rem", textAlign: "center" }}>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>

        <td style={{ border: "none" }}>No Product Found</td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
        <td style={{ border: "none" }}></td>
      </tr>
    );
  }
  return (
    <>
      {inventory.map((invent, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <img src={invent.file} alt="product" width={60} />
            </td>
            <td>{invent.title}</td>
            <td>{invent.qty}</td>
            <td>{invent.type}</td>
            <td>{invent.prize}</td>

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

            {/* </tr> */}
            {/* </td> */}
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
              title:
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.toLowerCase())}
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
                  type="number"
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
                  type="number"
                  className="form-control"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
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
function But() {
  <Link onClick={() => window.location.reload()}>OK</Link>;
}
