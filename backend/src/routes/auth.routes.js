const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth.middleware");

router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const nameExists = await User.findOne({ fullName });
        if (nameExists) {
            return res.status(409).json({
                message: "Name already exists"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            password: hashed
        });

        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        console.error("Signup error:", err);

        // Handle Mongo unique constraint error
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({ message: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Check status
        if (user.status === "inactive") {
            return res.status(401).json({ message: "Account is inactive" });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 4. Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

module.exports = router;
