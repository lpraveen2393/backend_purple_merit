const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth, admin } = require("../middleware/auth.middleware");


const router = express.Router();

/* =========================
   ADMIN: GET USERS (PAGINATED)
   ========================= */
router.get("/", auth, admin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (err) {
        console.error("Admin fetch users error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

/* =========================
   ADMIN: ACTIVATE / DEACTIVATE
   ========================= */
router.patch("/:id/:action", auth, admin, async (req, res) => {
    try {
        const { id, action } = req.params;

        if (!["activate", "deactivate"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const status = action === "activate" ? "active" : "inactive";

        await User.findByIdAndUpdate(id, { status });

        res.json({ message: `User ${status}` });
    } catch (err) {
        console.error("User status update error:", err);
        res.status(500).json({ message: "Failed to update user status" });
    }
});

/* =========================
   USER: UPDATE PROFILE
   ========================= */
router.put("/me", auth, async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName && !email) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        if (email) {
            const emailExists = await User.findOne({
                email,
                _id: { $ne: req.user.id }
            });

            if (emailExists) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }

        if (fullName) {
            const nameExists = await User.findOne({
                fullName,
                _id: { $ne: req.user.id }
            });

            if (nameExists) {
                return res.status(409).json({
                    message: "Name already exists"
                });
            }
        }

        await User.findByIdAndUpdate(req.user.id, {
            ...(fullName && { fullName }),
            ...(email && { email })
        });

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});


/* =========================
   USER: CHANGE PASSWORD
   ========================= */
router.put("/change-password", auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (newPassword.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id);

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).json({ message: "Old password incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ message: "Failed to update password" });
    }
});

module.exports = router;
