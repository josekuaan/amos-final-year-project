import React, { useState, useEffect, createContext } from "react";
import BASE_URL from "./base_url";
const axios = require("axios");

const WalletContext = createContext();

const DataProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [currentuser, setCurrentUser] = useState([]);

  const [sale, setSale] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategory] = useState([]);
  const [others, setOthers] = useState([]);
  const [level, setLevel] = useState([]);
  const [Returned, setReturn] = useState([]);
  const userId = window.localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    getData();
    return () => {
      isMounted = false;
    };
  }, []);

  const getData = async () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${BASE_URL}/api/user/auth/getMe/${userId}`, config)
      .then(function (response) {
        // handle success
        if (response.data.success) {
          setCurrentUser([response.data.msg]);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
      })
      .then(function () {});
  };

  return (
    <WalletContext.Provider
      value={{
        users,
        setUsers,
        currentuser,
        setCurrentUser,
        setSale,
        sale,
        inventory,
        setInventory,
        categories,
        setCategory,
        others,
        setOthers,
        setLevel,
        level,
        Returned,
        setReturn,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export { DataProvider, WalletContext };
