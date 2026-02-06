const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const path = require("path");
const https = require("https");
const fs = require("fs");
const userRouter = require("./routes/user");
const profileRoutes = require("./routes/profile");
const collectionRoutes = require("./routes/collections");
const workerRoutes = require("./routes/worker");
const binRoutes = require("./routes/bins");
const truckRoutes = require("./routes/truckRoutes");
const educationRoutes = require("./routes/education");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

mongoose
  .connect(process.env.MONGO_URI) // Remove the object with useNewUrlParser and useUnifiedTopology
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
  
app.use("/api", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/bins", binRoutes);
app.use("/api", truckRoutes);
app.use("/api/education", educationRoutes);

const PORT = process.env.PORT || 5000;

// Change 'server' to 'app'
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);