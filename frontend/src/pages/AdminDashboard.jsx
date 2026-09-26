import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      const response = await api.get("/leaves/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaves(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const processLeave = async (id, action) => {
    try {
      await api.put(
        `/leaves/admin/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadLeaves();
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h2>Leave Management System</h2>
          <span>Admin Portal</span>
        </div>

        <div className="topbar-right">
          <span>Administrator</span>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard">
        <div className="welcome">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Review and manage employee leave requests.</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Total Requests</span>
            <strong>{leaves.length}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

          <div className="stat-card">
            <span>Approved</span>
            <strong>{approved}</strong>
          </div>

          <div className="stat-card">
            <span>Rejected</span>
            <strong>{rejected}</strong>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>Leave Requests</h2>
          </div>

          {leaves.length === 0 ? (
            <p className="empty">No leave requests found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <strong>{leave.employee?.name}</strong>
                        <small className="email">
                          {leave.employee?.email}
                        </small>
                      </td>

                      <td>{leave.leaveType}</td>

                      <td>
                        {new Date(leave.startDate).toLocaleDateString()}
                        {" - "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>

                      <td>{leave.reason}</td>

                      <td>
                        <span className={`status ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>

                      <td>
                        {leave.status === "Pending" ? (
                          <div className="actions">
                            <button
                              className="approve"
                              onClick={() =>
                                processLeave(leave._id, "approve")
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="reject"
                              onClick={() =>
                                processLeave(leave._id, "reject")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="processed">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;