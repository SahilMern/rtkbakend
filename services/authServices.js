const jwt = require("jsonwebtoken");
const { UserToken } = require("../models/tokenModel");
const issData = require("./issService");
const { exists } = require("../models/prodctsModel");
const userModel = require("../models/userModel");
require("dotenv").config();
let jwtSecretKey =
  "26ae4b1f75b5456402da4c7807e54bd8e0974a080156210af9a66402079fedeb";

const createToken = async (req, res, data) => {
  // Get the domain and API route
  const domain = req.get("host") || req.get("origin");
  const api = req.originalUrl;
  const iss = domain + api;

  // Define the default response message
  let message = {
    isVerified: false,
    token: "",
  };

  // Check if the API route is in the allowed list (issData)
  if (issData.indexOf(api) !== -1) {
    try {
      const token = jwt.sign({ iss: iss, data: data }, jwtSecretKey, {
        expiresIn: 3600 * 24, // 24 hours in seconds
      });

      const existingToken = await UserToken.findOne(
        { userId: data.userId },
        { new: true }
      );

      if (existingToken) {
        existingToken.token = token;
        await existingToken.save();
      } else {
        const userToken = new UserToken({
          userId: data.userId,
          token: token,
          active: 1,
          expiresIn: 3600 * 24,
        });
        await userToken.save();
      }

      message = {
        isVerified: true,
        token: token,
      };
    } catch (error) {
      console.error(error);
    }
  }

  return message;
};

// const verifyToken = async (req, res) => {
//   try {
//     const bearerHeader = req.headers["authorization"];

//     if (!bearerHeader) {
//       return {
//         message: "Token is missing",
//         isVerified: false,
//         data: null,
//       };
//     }

//     const token = bearerHeader.split(" ")[1];
//     const matchToken = await UserToken.findOne({ token });

//     if (!matchToken) {
//       return {
//         message: "Invalid Token",
//         isVerified: false,
//         data: null,
//       };
//     }

//     if (matchToken.active !== 1) {
//       return {
//         message: "Token Expired",
//         isVerified: false,
//         data: null,
//       };
//     }
//     // Verify the token's validity and decode its payload
//     const decode = jwt.verify(token, jwtSecretKey);
//     return {
//       message: "Success",
//       isVerified: true,
//       data: decode,
//       token,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       message: "Unauthorized User",
//       isVerified: false,
//       data: null,
//     };
//   }
// };

// const createForgetPassToken = async (req, res, data) => {
//   const domain = req.get("host") || req.get("origin");
//   const api = req.originalUrl;
//   const iss = domain + api;
//   let message = {
//     isVerified: false,
//     token: "",
//   };
//   // Assuming issData is an array of allowed APIs
//   if (issData.indexOf(api) != -1) {
//     const token = await jwt.sign({ iss: iss, data: data }, jwtSecretKey, {
//       expiresIn: 300,
//     });

//     const userToken = new UserToken({
//       userId: data.userId,
//       token: token,
//       active: 1,
//       expiresIn: 300,
//     });
//     try {
//       await userToken.save();
//       message = {
//         isVerified: true,
//         token: token,
//       };
//     } catch (err) {
//       console.error("Error saving user token:", err);
//       message = {
//         isVerified: false,
//         token: "",
//       };
//     }
//   } else {
//     message = {
//       isVerified: false,
//       token: "",
//     };
//   }
//   return message;
// };

// const verifyResetPassToken = async (req, res, resetToken) => {
//   try {
//     if (!resetToken) {
//       return {
//         message: "Invalid token: Token is missing",
//         isVerified: false,
//       };
//     }
//     // Find the user token in the database
//     const matchToken = await UserToken.findOne({ token: resetToken });
//     if (!matchToken) {
//       return {
//         message: "Invalid reset token: Token not found",
//         isVerified: false,
//       };
//     }
//     // Verify the token
//     const decode = jwt.verify(
//       resetToken,
//       jwtSecretKey,
//       async (error, decoded) => {
//         if (error) {
//           if (error.name === "TokenExpiredError") {
//             // If the token is expired, mark it as inactive in the database
//             await UserToken.updateOne(
//               { token: resetToken },
//               { $set: { active: 0 } }
//             );
//             return { message: "Reset Link has expired", isVerified: false };
//           } else {
//             return { message: "Invalid token", isVerified: false };
//           }
//         }
//         return {
//           message: "Token is valid",
//           isVerified: true,
//           data: decoded,
//           token: resetToken,
//         };
//       }
//     );
//     return decode;
//   } catch (error) {
//     console.log(error);
//     return {
//       message: "UnAuthorized User !!",
//       isVerified: false,
//     };
//   }
// };

const AuthUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: 401, message: "Unauthorized, no token provided" });
    }
    const verifyToken = jwt.verify(token, jwtSecretKey);
    console.log(verifyToken.data, "verifyToken saaa");
    const userUniqueId = verifyToken.data.userId;
    console.log(userUniqueId, "unqie");
    const rootUser = await UserToken.findOne({
      userId: userUniqueId,
      token: token,
    });
    console.log(`${rootUser} AUTH WALA ROORTUSER`);
    if (!rootUser) {
      throw new Error("USER NOT FOUND BY AUTH PAGE ");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: 401, message: "Unautherised no token provide" });
  }
};

module.exports = {
  createToken,
  AuthUser,
  // verifyToken,
  // createForgetPassToken,
  // verifyResetPassToken,
};
