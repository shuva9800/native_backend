const express = require("express");
const app = express();
const { dbconnect } = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/user.route");

dotenv.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

app.use(express.json());
app.use(cors());

// Database connection
dbconnect();

// Routes
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Hello dashboard",
  });
});
app.use("/api/v1/auth", authRoutes);
