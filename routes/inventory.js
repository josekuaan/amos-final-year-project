const express = require("express");

const {
  getAllInventory,
  createCategory,
  createInventory,
  getSingleInventory,
  checkout,
  updateInventory,
  deleteInventory,
} = require("../controller/inventory");
const { protect, authorize } = require("../middleWare/auth");

const Router = express.Router();

Router.route("/create-inventory").post(
  protect,
  authorize("admin"),
  createInventory
);

Router.route("/checkout").post(protect, checkout);
// Router.route("/get-sale-id/:id").get(protect, getSaleId);
Router.route("/get-single-inventory/:id").get(
  protect,

  getSingleInventory
);
// protect,
Router.route("/get-inventories").get(getAllInventory);
Router.route("/update-inventory/:id").put(
  protect,
  authorize("admin"),
  updateInventory
);

// Router.route("/update-sale/:id").put(protect, authorize("admin"), updateSale);

Router.delete(
  "/delete-user-inventory/:id",
  protect,
  authorize("admin"),
  deleteInventory
);

// Router.delete("/delete-user-sale/:id", protect, authorize("admin"), deleteSale);

module.exports = Router;
