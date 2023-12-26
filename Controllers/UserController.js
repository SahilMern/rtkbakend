const userModel = require("../models/userModel");

//userRegister
const userRegister = async(req, res) => {
    try {
        const {name,email, password, confirmPassword} = req.body;
        console.log(name,email, password, confirmPassword);
        //required file 
        const requiredFields = ["name","email", "password", "confirmPassword"];
        for (const field of requiredFields) {
            if (!(field in req.body) || !req.body[field]) {
              return res.status(400).json({
                status: false,
                message: `Field '${field}' must have a value`,
              });
            }
          }

          const userData = new userModel({
            name,email, password, confirmPassword
          })
          await userData.save()
          return res.status(200).json({
            message:"User regsitered suseesfully"
          })
    } catch (error) {
        console.log(error,"error");
    }
}

//userLogin
const userLogin = () => {
    try {
        
    } catch (error) {
        console.log(error,"error");
    }
}

module.exports = {userRegister, userLogin};