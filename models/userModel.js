const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword:{
    type:String,
    required:true
},
  registerDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.confirmPassword, 10);
  }
  next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;