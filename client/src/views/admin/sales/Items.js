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
      {sale.map((invent, _) =>
        invent.sales.map((sale, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img src={sale.file} alt="sale" width={60} />
              </td>
              <td>{sale.title}</td>
              <td>{sale.qty}</td>

              <td>{invent.paymentType}</td>
              <td>{sale.prize}</td>
              <td>{sale.prize * sale.qty}</td>

              <td>{moment(invent.date).format("MMMM Do YYYY")}</td>

              <td style={{ width: "17%" }}>
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
        })
      )}
    </>
  );
}
function But() {
  <Link onClick={() => window.location.reload()}>OK</Link>;
}
