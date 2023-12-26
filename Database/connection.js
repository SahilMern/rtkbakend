const mongoose = require("mongoose");
const databaseUrl = "mongodb://localhost:27017/mern";
mongoose.set("strictQuery", true);

const db = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log("Connection Successfully, JAI HANUMAN JI");
  } catch (error) {
    console.log(error, "error");
  }
};

db();
