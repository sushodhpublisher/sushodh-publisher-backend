const Order = require("../models/Order");
const Book = require("../models/Book");
const generateOrderId = require("../utils/generateOrderId");

exports.createOrder = async (req, res) => {
  try {
    const { bookId, quantity, buyerName, buyerPhone, buyerAddress } = req.body;

    if (!bookId || !quantity || !buyerName || !buyerPhone || !buyerAddress) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const book = await Book.findById(bookId);

    if (!book || !book.isActive) {
      return res.status(404).json({
        message: "Book not available",
      });
    }

    const totalAmount = book.price * quantity;
    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      bookId: book._id,
      bookTitle: book.title,
      quantity,
      totalAmount,
      buyerName,
      buyerPhone,
      buyerAddress,
    });

    return res.status(201).json({
      message: "Order created successfully",
      orderId: order.orderId,
      amount: order.totalAmount,
      bookTitle: order.bookTitle,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
