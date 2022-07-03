const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  sales: {
    type: [{}],
    required: true,
    trim: true,
  },
  paymentType: {
    type: String,
    default: "ETH",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("checkouts", SalesSchema);
