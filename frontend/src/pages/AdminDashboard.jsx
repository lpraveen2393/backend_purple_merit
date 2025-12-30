import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [confirm, setConfirm] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            const res = await api.get(`/users?page=${page}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch users:", err.response || err);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [page]);


    const handleActionClick = (id, action) => {
        setConfirm({ id, action });
    };

    const confirmAction = async () => {
        await api.patch(`/users/${confirm.id}/${confirm.action}`);

        setUsers((prev) =>
            prev.map((u) =>
                u._id === confirm.id
                    ? { ...u, status: confirm.action === "activate" ? "active" : "inactive" }
                    : u
            )
        );

        setConfirm(null);
    };

    const activeCount = users.filter(u => u.status === "active").length;
    const inactiveCount = users.length - activeCount;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h1>User Management</h1>
                <p>Manage user access and account status</p>
            </header>

            <div className="admin-stats">
                <div className="stat-card">
                    <span>Total Users</span>
                    <strong>{users.length}</strong>
                </div>
                <div className="stat-card success">
                    <span>Active</span>
                    <strong>{activeCount}</strong>
                </div>
                <div className="stat-card danger">
                    <span>Inactive</span>
                    <strong>{inactiveCount}</strong>
                </div>
            </div>

            <div className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Status</th>
                            <th align="right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="email-cell">{u.email}</td>

                                <td>
                                    <span
                                        className={`status-badge ${u.status === "active" ? "active" : "inactive"
                                            }`}
                                    >
                                        {u.status}
                                    </span>
                                </td>

                                <td align="right">
                                    {u.status === "active" ? (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleActionClick(u._id, "deactivate")}
                                        >
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleActionClick(u._id, "activate")}
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    className="page-nav"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                <div className="page-indicator">
                    Page <span>{page}</span> of <span>{totalPages}</span>
                </div>

                <button
                    className="page-nav"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>


            <Modal
                open={!!confirm}
                text={`Are you sure you want to ${confirm?.action} this user?`}
                onConfirm={confirmAction}
                onClose={() => setConfirm(null)}
            />
        </div>
    );
}
