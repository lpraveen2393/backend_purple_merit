import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName || !form.email || !form.password) {
            return setError("All fields are required");
        }

        if (!form.email.includes("@")) {
            return setError("Invalid email address");
        }

        if (form.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            await api.post("/auth/signup", {
                fullName: form.fullName,
                email: form.email,
                password: form.password
            });

            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join and get started</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field">
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Creating account…" : "Sign Up"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
