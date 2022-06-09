import React, { useEffect, useContext, useState } from "react";

import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import * as moment from "moment";
import { WalletContext } from "../../../pageContext";
// import happy from "../../../assets/icons/happiness.svg";
import Modal from "./DashBoardmodal";
import ReoderModal from "./ReoderModal";
import color from "./ColorPallet";
import "../../style.css";
import BASE_URL from "src/base_url";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
} from "@coreui/react";

import { CChartBar } from "@coreui/react-chartjs";

const Dashboard = () => {
  const { setOthers, setUsers, users, level, setLevel, setInventory } =
    useContext(WalletContext);

  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const token = localStorage.getItem("token");

  const [grouped, setGrouped] = useState([]);
  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("");
  const [day, setDay] = useState("");
  const [dateChange, setDateChange] = useState("");
  const [currentMonth, setCurrentMonth] = useState([]);
  const [currenFormattMonth, setCurrentFormatMonth] = useState([]);
  const [currenFormattWeek, setCurrentFormatWeek] = useState([]);
  const [currenFormattDay, setCurrentFormatDay] = useState([]);
  const [originalMonth, setOriginalMonth] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [currentDay, setCurrentDay] = useState([]);
  const [originalWeek, setOriginalWeek] = useState([]);
  const [originalDay, setOriginalDay] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalWeek, setModalWeek] = useState(false);
  const [modalDay, setModalDay] = useState(false);
  const [modalMonth, setModalMonth] = useState(false);
  var daySum = 0;
  var weekSum = 0;
  var monthSum = 0;
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

    axios
      .get(`${BASE_URL}/api/inventory/get-inventories`, config)
      .then(function (response) {
        if (response.data.success) {
          setInventory(response.data.inventory);
          for (var i = 0; i < response.data.inventory.length; i++) {
            if (
              response.data.inventory[i].qty <=
              response.data.inventory[i].otherLevel
            ) {
              setLevel([response.data.inventory[i]]);
            }
          }
          const grouped = response.data.inventory.reduce(
            ((map) => (r, a) => {
              map.set(
                a.category,
                map.get(a.category) ||
                  r[r.push({ category: a.category, quantity: 0 }) - 1]
              );
              map.get(a.category).quantity += a.qty;
              return r;
            })(new Map()),
            []
          );

          setGrouped(grouped);
        }
      });

    axios
      .get(`${BASE_URL}/api/inventory/get-sales-by-day-week-month-year`, config)
      .then(function (response) {
        if (response.data.success) {
          let monthSum = 0;
          for (var i = 0; i < response.data.month.length; i++) {
            monthSum += response.data.month[i].totalAmount;
          }

          setCurrentMonth(response.data.month);
          setOriginalMonth(response.data.month);
          setMonth(monthSum);
          let weekSum = 0;
          for (var i = 0; i < response.data.week.length; i++) {
            weekSum += response.data.week[i].totalAmount;
          }

          setCurrentWeek(response.data.week);
          setOriginalWeek(response.data.week);
          setWeek(weekSum);

          let daySum = 0;
          for (var i = 0; i < response.data.day.length; i++) {
            daySum += response.data.day[i].totalAmount;
          }

          setCurrentDay(response.data.day);
          setOriginalDay(response.data.day);
          setDay(daySum);
        }
      });
  };
  const handleFetch = async (input) => {
    axios
      .get(`${BASE_URL}/api/inventory/get-qty?query=${input}`, config)
      .then(function (response) {
        if (response.data.success) {
          setOthers(response.data.inventory);
        }
      });
  };
  const onDateChange = (e) => {
    const { value } = e.target;
    setDateChange(value);

    let salePerMonth = currentMonth.slice().filter((sal) => {
      if (moment(sal.date).format("YYYY-MM-DD") === value) {
        return sal;
      }
    });
    let salePerWeek = currentWeek.slice().filter((sal) => {
      if (moment(sal.date).format("YYYY-MM-DD") === value) {
        return sal;
      }
    });
    let salePerDay = currentDay.slice().filter((sal) => {
      if (moment(sal.date).format("YYYY-MM-DD") === value) {
        return sal;
      }
    });

    setCurrentFormatMonth(salePerMonth);
    setCurrentMonth(salePerMonth);
    setCurrentFormatWeek(salePerWeek);
    setCurrentWeek(salePerWeek);
    setCurrentDay(salePerDay);
    setCurrentFormatDay(salePerDay);
  };
  const onChangePayment = (e) => {
    const { value } = e.target;

    if (value === "alltransactions") {
      setCurrentMonth(originalMonth);
      setCurrentWeek(originalWeek);
      setCurrentDay(originalDay);
    } else if (value === "cash") {
      let week = currenFormattWeek
        .slice()
        .filter((week) => week.payment === value);
      let month = currenFormattMonth
        .slice()
        .filter((month) => month.payment === value);
      let day = currenFormattDay.slice().filter((day) => day.payment === value);

      setCurrentMonth(month);
      setCurrentWeek(week);
      setCurrentDay(day);
    } else if (value === "credit") {
      let week = currenFormattWeek
        .slice()
        .filter((week) => week.payment === value);
      let month = currenFormattMonth
        .slice()
        .filter((month) => month.payment === value);
      let day = currenFormattDay.slice().filter((day) => day.payment === value);

      setCurrentMonth(month);
      setCurrentWeek(week);
      setCurrentDay(day);
    } else if (value === "transfer") {
      let week = currenFormattWeek
        .slice()
        .filter((week) => week.payment === value);
      let month = currenFormattMonth
        .slice()
        .filter((month) => month.payment === value);
      let day = currenFormattDay.slice().filter((day) => day.payment === value);

      setCurrentMonth(month);
      setCurrentWeek(week);
      setCurrentDay(day);
    }
  };
  const onChangeUser = (e) => {
    const { value } = e.target;
    if (value === "alluser") {
      setCurrentMonth(originalMonth);
      setCurrentWeek(originalWeek);
      setCurrentDay(originalDay);
    } else {
      let week = originalWeek.slice().filter((week) => week.userId === value);
      let month = originalMonth
        .slice()
        .filter((month) => month.userId === value);
      let day = originalDay.slice().filter((day) => day.userId === value);

      setCurrentMonth(month);

      setCurrentWeek(week);
      setCurrentFormatDay(day);
      setCurrentDay(day);
    }
  };
  const Reset = () => {
    setDateChange("");
    setCurrentMonth(currenFormattMonth);
    setCurrentWeek(currenFormattWeek);
  };
  if (isLoggedIn === null) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="content">
        <CRow>
          {grouped.length === 0 ? (
            <CCol sm="6" lg="4">
              <div className="bg-gradient-primary card">
                <h3 style={{ color: "white", textTransform: "capitalize" }}>
                  No Product Created
                </h3>
              </div>
            </CCol>
          ) : (
            grouped.map((group, index) => {
              return (
                <CCol sm="6" lg="4" key={index}>
                  <div
                    className={`${color[index]} card`}
                    onClick={() => {
                      handleFetch(group.category);
                      setModal(!modal);
                    }}
                  >
                    <h3 style={{ color: "white", textTransform: "capitalize" }}>
                      {group.category}
                    </h3>
                    <div>
                      {group.quantity ? group.quantity : "Not Created yet"}
                    </div>
                  </div>
                </CCol>
              );
            })
          )}
          <Modal modal={modal} setModal={setModal} />
          {level.length > 0 ? <ReoderModal level={level} /> : ""}
        </CRow>

        <div className="row">
          <div className="col-md-12">
            <CCard>
              <CCardHeader>Bar Chart</CCardHeader>
              <CCardBody>
                <CChartBar
                  datasets={[
                    {
                      label: "Sales per month",
                      backgroundColor: "#f87979",
                      data: [10, 22, 34, 46, 58, 70, 46, 23, 45, 78, 34, 12],
                    },
                  ]}
                  labels="months"
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalDay(!modal)}
              style={{ cursor: "pointer" }}
            >
              <h5 style={{ padding: "20px 10px 0px" }}>
                <small>TODAY SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <span className="interest" style={{ color: "#fff" }}>
                    {day.length === 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${day === 0 ? day : `N${day}`}`}</span>
                    )}
                  </span>
                  <div style={{ marginTop: "14px" }}>
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>VS average
                    </small>
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalWeek(!modal)}
              style={{ cursor: "pointer" }}
            >
              <h5 style={{ padding: "20px 10px 0px" }}>
                <small>THIS WEEK SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <div className="withdraw">
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>
                    </small>{" "}
                    {week.length == 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${week === 0 ? week : `N${week}`}`}</span>
                    )}
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card"
              onClick={() => setModalMonth(!modal)}
              style={{ cursor: "pointer" }}
            >
              <h5 style={{ padding: "20px 10px 0px" }}>
                <small>THIS MONTH SALES</small>
              </h5>
              <div className="card-header roi">
                <div className="">
                  <div className="balance">
                    <small>
                      <i className="fas fa-long-arrow-alt-down"></i>
                    </small>{" "}
                    {month.length == 0 ? (
                      <span>0.00</span>
                    ) : (
                      <span>{`${month === 0 ? month : `N${month}`}`}</span>
                    )}
                  </div>

                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CModal show={modalMonth} onClose={() => setModalMonth()}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              );
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className=" table-responsive">
              <table
                className="table table-bordered"
                style={{ marginBottom: "0rem" }}
              >
                <thead>
                  <tr>
                    {/* <th>S/N</th> */}
                    <th>QTY</th>
                    <th>CATEGORY</th>
                    <th>TYPE</th>
                    <th>PAYMENT</th>
                    <th>PRICE</th>
                    <th>TOTAL</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMonth.map((invent, index) => {
                    return (
                      <>
                        <tr key={index}>
                          {/* <td>{index + 1}</td> */}
                          <td>{invent.qty}</td>
                          <td>{invent.category}</td>
                          <td>{invent.type}</td>
                          <td>{invent.payment}</td>
                          <td>{invent.prize}</td>

                          <td>
                            {" "}
                            {`NGN${
                              Number(invent.convertedqty) === 1
                                ? invent.prize
                                : invent.prize * invent.qty
                            }`}
                          </td>
                          <td>{moment(invent.date).format("DD/MM/YYYY")}</td>
                        </tr>
                      </>
                    );
                  })}
                  {currentMonth.map((current, index) => {
                    monthSum +=
                      Number(current.convertedqty) === 1
                        ? current.prize
                        : current.prize * current.qty;
                  })}

                  <tr>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td>Grand Total</td>
                    <td>{monthSum}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <select
            className="form-control"
            style={{ width: " 26%" }}
            onChange={onChangePayment}
          >
            <option value="alltransactions">All transactions</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
            <option value="credit">Credit</option>
          </select>
          <CButton color="secondary">
            <input
              type="date"
              value={dateChange}
              onChange={onDateChange}
              required
            />
          </CButton>
          <CButton color="secondary" onClick={() => Reset()}>
            Reset
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal show={modalWeek} onClose={() => setModalWeek()}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              );
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className=" table-responsive">
              <table
                className="table table-bordered"
                style={{ marginBottom: "0rem" }}
              >
                <thead>
                  <tr>
                    {/* <th>S/N</th> */}
                    <th>QTY</th>
                    <th>CATEGORY</th>
                    <th>TYPE</th>
                    <th>PAYMENT</th>
                    <th>PRICE</th>
                    <th>TOTAL</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWeek.map((invent, index) => {
                    return (
                      <tr key={index}>
                        {/* <td>{index + 1}</td> */}
                        <td>{invent.qty}</td>
                        <td>{invent.category}</td>
                        <td>{invent.type}</td>
                        <td>{invent.payment}</td>
                        <td>{invent.prize}</td>

                        <td>
                          {" "}
                          {`NGN${
                            Number(invent.convertedqty) === 1
                              ? invent.prize
                              : invent.prize * invent.qty
                          }`}
                        </td>
                        <td>{moment(invent.date).format("DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
                  {currentWeek.map((current, index) => {
                    weekSum +=
                      Number(current.convertedqty) === 1
                        ? current.prize
                        : current.prize * current.qty;
                  })}

                  <tr>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td>Grand Total</td>
                    <td>{weekSum}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <select
            className="form-control"
            style={{ width: " 26%" }}
            onChange={onChangePayment}
          >
            <option value="alltransactions">All transactions</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
            <option value="credit">Credit</option>)
          </select>
          <CButton color="secondary">
            <input type="date" onChange={onDateChange} required />
          </CButton>
          <CButton color="secondary" onClick={() => Reset()}>
            Reset
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal show={modalDay} onClose={() => setModalDay()}>
        <CModalHeader closeButton>
          <select className="form-control choose-user" onChange={onChangeUser}>
            <option value="alluser">All users</option>
            {users.map((user, index) => {
              return (
                <option key={index} value={user._id}>
                  {user.fullName}
                </option>
              );
            })}
          </select>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className=" table-responsive">
              <table
                className="table table-bordered"
                style={{ marginBottom: "0rem" }}
              >
                <thead>
                  <tr>
                    {/* <th>S/N</th> */}
                    <th>QTY</th>
                    <th>CATEGORY</th>
                    <th>TYPE</th>
                    <th>PAYMENT</th>

                    <th>PRICE</th>
                    <th>TOTAL</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDay.map((invent, index) => {
                    return (
                      <tr key={index}>
                        {/* <td>{index + 1}</td> */}

                        <td>{invent.qty}</td>
                        <td>{invent.category}</td>
                        <td>{invent.type}</td>
                        <td>{invent.payment}</td>
                        <td>{invent.prize}</td>

                        <td>
                          {" "}
                          {`NGN${
                            Number(invent.convertedqty) === 1
                              ? invent.prize
                              : invent.prize * invent.qty
                          }`}
                        </td>
                        <td>{moment(invent.date).format("DD/MM/YYYY")}</td>
                      </tr>
                    );
                  })}
                  {currentDay.map((current, index) => {
                    daySum +=
                      Number(current.convertedqty) === 1
                        ? current.prize
                        : current.prize * current.qty;
                  })}

                  <tr>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td style={{ border: "none" }}></td>
                    <td>Grand Total</td>
                    <td>{daySum}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <select
            className="form-control"
            style={{ width: " 26%" }}
            onChange={onChangePayment}
          >
            <option value="alltransactions">All transactions</option>
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
            <option value="credit">Credit</option>
          </select>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Dashboard;
