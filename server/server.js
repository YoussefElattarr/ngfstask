require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import product routes
const productRoutes = require("./routes/product");

// Use environment variables
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

// MongoDB Connection
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const app = express();
//allow cors
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h3>HOMEPAGE<h3>");
});
app.use("/product", productRoutes);


module.exports = app.listen(port, () => console.log(`Server running on port ${port}`));

