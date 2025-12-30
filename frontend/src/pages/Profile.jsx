import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
    const { user } = useContext(AuthContext);

    const [fullName, setFullName] = useState(user.fullName);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const initials = user.fullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();

    const saveProfile = async () => {
        try {
            setSavingProfile(true);
            setProfileMessage("");
            await api.put("/users/me", { fullName });
            setProfileMessage("Profile updated successfully");
        } catch {
            setProfileMessage("Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const changePassword = async () => {
        if (!oldPassword || !newPassword) {
            return setPasswordMessage("All password fields are required");
        }

        if (newPassword.length < 6) {
            return setPasswordMessage("New password must be at least 6 characters");
        }

        try {
            setChangingPassword(true);
            setPasswordMessage("");

            await api.put("/users/change-password", {
                oldPassword,
                newPassword
            });

            setPasswordMessage("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            console.error("Password error:", err.response || err);
            setPasswordMessage(
                err.response?.data?.message || "Failed to update password"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{initials}</div>
                    <div className="profile-meta">
                        <h2>{user.fullName}</h2>
                        <p>{user.email}</p>
                        <div className="meta-tags">
                            <span className="tag role">{user.role}</span>
                            <span className={`tag status ${user.status}`}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-form">
                    <h3>Profile Information</h3>

                    <div className="field">
                        <label>Full Name</label>
                        <input value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <input value={user.email} disabled />
                    </div>

                    <button className="profile-save-btn" onClick={saveProfile}>
                        {savingProfile ? "Saving..." : "Save Changes"}
                    </button>

                    {profileMessage && <p className="profile-message">{profileMessage}</p>}

                    <hr className="profile-divider" />

                    <h3>Change Password</h3>

                    <div className="field">
                        <label>Old Password</label>
                        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </div>

                    <div className="field">
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>

                    <button className="profile-save-btn" onClick={changePassword}>
                        {changingPassword ? "Updating..." : "Update Password"}
                    </button>

                    {passwordMessage && <p className="profile-message">{passwordMessage}</p>}
                </div>
            </div>
        </div>
    );
}
