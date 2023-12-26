const express = require("express");
const {userRegister} = require("../Controllers/UserController");
const router= express.Router()

//User Register 
router.post("/userRegister",userRegister);

module.exports = router;