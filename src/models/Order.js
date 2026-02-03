const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    bookTitle: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    buyerName: {
      type: String,
      required: true,
      trim: true,
    },

    buyerPhone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    buyerAddress: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "CANCELLED"],
      default: "CREATED",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
