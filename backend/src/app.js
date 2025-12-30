const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   Routes
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* ======================
   Health Check
====================== */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

module.exports = app;