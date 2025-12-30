const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        fullName: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, enum: ["admin", "user"], default: "user" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        lastLogin: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", schema);
