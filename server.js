const express = require("express");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const cors = require("cors");
const galleryRoutes = require("./routes/galleryRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// middleware
app.use(express.json());
app.use("/api/gallery", galleryRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.use("/api/blogs", blogRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});