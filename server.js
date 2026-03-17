require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db.js");
const urlRoutes = require("./routes/urlRoutes.js");

const app = express();

connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use(urlRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));