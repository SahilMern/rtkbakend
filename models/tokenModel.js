const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  active: {
    type: Number,
    default: 1,
  },
  expiresIn: {
    type: Number,
  },
});

// Create a Mongoose model for the userToken collection
const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = { UserToken };
