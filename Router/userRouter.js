const express = require("express");
const router= express.Router()

const {userRegister, userLogin, allUser, userLogout} = require("../Controllers/UserController");
const { AuthUser } = require("../services/authServices");


router.post("/userRegister",userRegister); //TODO: User Register 
router.post("/userLogin",userLogin); //TODO: User Login
router.get("/allUsers",AuthUser,allUser) //TODO:GET ALL USER
router.post("/userLogout", AuthUser,userLogout)


module.exports = router;