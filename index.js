const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
require("./Database/connection");
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: 'rzp_test_e2OQAlQAua7sHE',
  key_secret: 'AHnADnP3jc4GsFFCtwJZW3CS',
});

const userrouter = require("./Router/userRouter");
const userModel = require("./models/userModel");
const Products = require("./models/prodctsModel");
const productsData = require("./helper/ProductsData");
app.use("/api/user", userrouter);

app.get("/products", async (req, res) => {
  // console.log(req.query, "query");

  const gender = req.query.gender || "";
  console.log(gender);
  const filters = req.query.filter ? req.query.filter.split(",") : [];
  const page = parseInt(req.query.page) || 1; // Get the page number from query params
  const limit = 4; // Items per page

  const skip = (page - 1) * limit; // Calculate skip value for pagination

  const query = {};
  if (gender) {
    query.gender = gender;
  }
  if (filters.length > 0) {
    query.type = { $in: filters };
  }
  console.log(query, "important query");
  try {
    const totalProducts = await Products.countDocuments(query); // Get total count of products based on query
    console.log(totalProducts, "total products ");
    const productDataFromDb = await Products.find(query)
      .skip(skip) // Skip records based on page number and limit
      .limit(limit); // Limit records per page
    // console.log(Math.ceil(totalProducts / limit), "calcu");
    const totalPages = Math.ceil(totalProducts / limit);
    console.log(totalPages, "totalPages ");
    return res.status(200).json({
      message: "Jai Bajarang bali ji",
      currentPage: page,
      totalPages,
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

app.post("/payments", async(req, res) => {
  try {
    console.log(req.body);
    return res.status(200).json({
      // message:"req.body",
      data:"hiiii",
      status:200
    })
  } catch (error) {
    console.log(error);
  }
})

app.post('/payment', async (req, res) => {
  console.log(req.body.requestData.total,"BODY");
  const amountTotal = Number(req.body.requestData.total*100)
  const amount = amountTotal; // Replace with the total amount for the products
  const options = {
      amount: amount * 100, // Convert to paise (Rupees * 100)
      currency: 'INR',
      // receipt: 'order_rcptid_11',
  };

  try {
      const order = await razorpay.orders.create(options);
      console.log(order,"order order");
      // Save order details in your database
      // Return order ID or necessary details to frontend
      return res.json({ order });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/verification",async(req, res) => {
  try {
    // const 
    console.log(req.body);
    return res.status(200).json({
      message:"hiii"
    })
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, () => console.log(`App listening on portss ${port}!`));
