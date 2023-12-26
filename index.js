const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
require("./Database/connection");

const userrouter = require("./Router/userRouter");
const userModel = require("./models/userModel");
const Products = require("./models/prodctsModel");
const productsData = require("./helper/ProductsData");
app.use("/api/user", userrouter);

app.get("/products", async (req, res) => {
  console.log(req.query,"query");

  const gender = req.query.gender || "";
  const filters = req.query.filter ? req.query.filter.split(",") : [];
  const page = parseInt(req.query.page) || 1; // Get the page number from query params
  const limit = 10; // Items per page

  const skip = (page - 1) * limit; // Calculate skip value for pagination

  const query = {};
  if (gender) {
    query.gender = gender;
  }
  if (filters.length > 0) {
    query.type = { $in: filters };
  }
  console.log(query,"important query");
  try {
    const totalProducts = await Products.countDocuments(query); // Get total count of products based on query
    console.log(totalProducts, "total products ");
    const productDataFromDb = await Products.find(query)
      .skip(skip) // Skip records based on page number and limit
      .limit(limit); // Limit records per page
    console.log(Math.ceil(totalProducts / limit), "calcu");
    return res.status(200).json({
      message: "Jai Bajarang bali ji",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      productDataFromDb,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addProducts", async (req, res) => {
  try {
    const insertedProducts = await Products.insertMany(productsData);
    res.status(201).json({
      message: "Products added successfully",
      products: insertedProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add products", error: error.message });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
