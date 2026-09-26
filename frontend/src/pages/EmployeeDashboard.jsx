import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [balance, setBalance] = useState(user.leaveBalance || 0);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const balanceRes = await api.get("/leaves/balance", { headers });
        const historyRes = await api.get("/leaves/my-leaves", { headers });

        setBalance(balanceRes.data.leaveBalance);
        setLeaves(historyRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [token]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h2>Leave Management System</h2>
          <span>Employee Portal</span>
        </div>

        <div className="topbar-right">
          <span>Hi, {user.name}</span>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard">
        <div className="welcome">
          <div>
            <h1>Welcome back, {user.name} 👋</h1>
            <p>Manage your leave requests and track your balance.</p>
          </div>

          <Link to="/employee/apply" className="primary-btn">
            + Apply Leave
          </Link>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Leave Balance</span>
            <strong>{balance}</strong>
            <small>Days available</small>
          </div>

          <div className="stat-card">
            <span>Pending Requests</span>
            <strong>{pending}</strong>
            <small>Awaiting approval</small>
          </div>

          <div className="stat-card">
            <span>Approved Leaves</span>
            <strong>{approved}</strong>
            <small>Total approved</small>
          </div>

          <div className="stat-card">
            <span>Total Requests</span>
            <strong>{leaves.length}</strong>
            <small>All applications</small>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>Recent Leave Requests</h2>
            <Link to="/employee/history">View All</Link>
          </div>

          {leaves.length === 0 ? (
            <p className="empty">No leave requests yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.slice(0, 5).map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span className={`status ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="quick-links">
          <Link to="/employee/apply">Apply New Leave →</Link>
          <Link to="/employee/history">View Leave History →</Link>
        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;