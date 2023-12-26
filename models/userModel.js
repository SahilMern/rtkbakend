const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    role: {
        type: Number,
        enum: [0,1],
        default: 0
    }

})
const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;