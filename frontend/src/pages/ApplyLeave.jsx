import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function ApplyLeave() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const today = getTodayString();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Frontend date validation
    if (form.startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      await api.post("/leaves", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Leave application submitted successfully!");

      setTimeout(() => {
        navigate("/employee");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave");
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h2>Leave Management System</h2>
          <span>Apply Leave</span>
        </div>

        <Link to="/employee" className="back-link">
          ← Dashboard
        </Link>
      </header>

      <main className="form-page">
        <div className="form-card">
          <h1>Apply for Leave</h1>
          <p>Submit a new leave request for approval.</p>

          <form onSubmit={handleSubmit}>
            <label>Leave Type</label>

            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
            >
              <option>Casual</option>
              <option>Sick</option>
              <option>Earned</option>
              <option>Unpaid</option>
            </select>

            <div className="date-grid">
              <div>
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  min={today}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Reason</label>

            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Enter the reason for your leave..."
              rows="5"
              required
            />

            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            <button className="primary-btn full" type="submit">
              Submit Leave Request
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplyLeave;