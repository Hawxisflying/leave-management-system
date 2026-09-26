import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/leaves/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeaves(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h2>Leave Management System</h2>
          <span>Leave History</span>
        </div>

        <Link to="/employee" className="back-link">
          ← Dashboard
        </Link>
      </header>

      <main className="dashboard">
        <div className="page-title">
          <h1>Leave History</h1>
          <p>Track all your submitted leave requests.</p>
        </div>

        <div className="content-card">
          {leaves.length === 0 ? (
            <p className="empty">No leave history available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
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
      </main>
    </div>
  );
}

export default LeaveHistory;