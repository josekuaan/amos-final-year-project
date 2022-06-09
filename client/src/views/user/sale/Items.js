import React, { useContext } from "react";

import * as moment from "moment";

export default function Items({ loading, sale }) {
  if (loading) {
    return <h2>loading...</h2>;
  }
  return (
    <>
      {sale.map((invent, index) => {
        return (
          <tr key={index}>
            <td>{invent.qty}</td>
            <td>{invent.category}</td>
            <td>{invent.type}</td>
            <td>{invent.payment}</td>
            <td>{invent.prize}</td>
            <td>
              {`NGN${
                invent.qty === 0.5
                  ? invent.prize * parseInt(invent.qty.toFixed())
                  : invent.prize * invent.qty
              }`}
            </td>
            <td>{moment(invent.createdAt).format("DD/MM/YYYY")}</td>
          </tr>
        );
      })}
    </>
  );
}
