import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    return (
        <nav className="app-navbar">
            <div className="nav-left">
                <span className="app-logo">User Manager</span>
            </div>

            <div className="nav-right">
                <span className="user-pill">
                    {user.fullName}
                    <span className="role-pill">{user.role}</span>
                </span>

                {user.role === "admin" && (
                    <Link
                        to="/admin"
                        className={`nav-link ${location.pathname === "/admin" ? "active" : ""
                            }`}
                    >
                        Admin
                    </Link>
                )}

                <Link
                    to="/"
                    className={`nav-link ${location.pathname === "/" ? "active" : ""
                        }`}
                >
                    Profile
                </Link>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
