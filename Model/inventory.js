const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  filePublicId: {
    type: String,
    required: true,
    trim: true,
  },
  prize: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },

  // userId: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("records", RecordSchema);
