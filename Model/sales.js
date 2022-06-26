const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  sales: {
    type: Array,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("sales", SalesSchema);
