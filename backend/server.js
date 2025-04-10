require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");
const stockRoutes = require("./routes/stockroutes");
const reportRoutes = require("./routes/reportRoutes");
const activityRoutes = require("./routes/activityRoutes");
const orderRoutes=require("./routes/orderRoutes");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api", stockRoutes);
app.use("/api", reportRoutes);
app.use("/api", activityRoutes);
app.use("/", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
