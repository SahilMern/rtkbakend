const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sizes: {
    M: {
      type: Number,
      required: true,
      default: 0,
    },
    L: {
      type: Number,
      required: true,
      default: 0,
    },
    S: {
      type: Number,
      required: true,
      default: 0,
    },
    XL: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Children'] // Add the possible values for gender
  },
  type: {
    type: String,
    required: true,
    enum: ['Shirt', 'Jeans', 'T-shirt'] // Add the possible values for type
  }
});

const Products = mongoose.model("Product", productSchema);

module.exports = Products;
