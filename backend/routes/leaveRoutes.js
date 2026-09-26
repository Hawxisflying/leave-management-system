const express = require("express");
const jwt = require("jsonwebtoken");

const Leave = require("../models/leave");
const User = require("../models/user");

const router = express.Router();

// Authentication middleware
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

// Apply for leave
router.post("/", authenticate, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                message: "All leave fields are required",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid leave dates",
            });
        }

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDay = new Date(start);
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date(end);
        endDay.setHours(0, 0, 0, 0);

        // Leave cannot start in the past
        if (startDay < today) {
            return res.status(400).json({
                message: "Leave start date cannot be in the past",
            });
        }

        // End date cannot be before start date
        if (endDay < startDay) {
            return res.status(400).json({
                message: "End date cannot be before start date",
            });
        }

        // Calculate requested leave days
        const days =
            Math.floor((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1;

        // Check employee leave balance
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        if (user.leaveBalance < days) {
            return res.status(400).json({
                message: `Insufficient leave balance. Available balance: ${user.leaveBalance} day(s).`,
            });
        }

        const leave = await Leave.create({
            employee: req.user.id,
            leaveType,
            startDate: start,
            endDate: end,
            reason,
        });

        res.status(201).json({
            message: "Leave application submitted successfully",
            leave,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to apply for leave",
            error: error.message,
        });
    }
});

// Get employee leave history
router.get("/my-leaves", authenticate, async (req, res) => {
    try {
        const leaves = await Leave.find({
            employee: req.user.id,
        }).sort({ createdAt: -1 });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leave history",
            error: error.message,
        });
    }
});

// Get employee leave balance
router.get("/balance", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "name email leaveBalance"
        );

        res.json({
            name: user.name,
            email: user.email,
            leaveBalance: user.leaveBalance,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leave balance",
            error: error.message,
        });
    }
});

// Admin: get all leave requests
router.get("/admin/all", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }

        const leaves = await Leave.find()
            .populate("employee", "name email leaveBalance")
            .sort({ createdAt: -1 });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leave requests",
            error: error.message,
        });
    }
});

// Admin: approve leave
router.put("/admin/:id/approve", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found",
            });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({
                message: "Leave has already been processed",
            });
        }

        const user = await User.findById(leave.employee);

        if (!user) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);

        const days =
            Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (user.leaveBalance < days) {
            return res.status(400).json({
                message: "Insufficient leave balance",
            });
        }

        leave.status = "Approved";

        user.leaveBalance -= days;

        await leave.save();
        await user.save();

        res.json({
            message: "Leave approved successfully",
            leave,
            remainingBalance: user.leaveBalance,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to approve leave",
            error: error.message,
        });
    }
});

// Admin: reject leave
router.put("/admin/:id/reject", authenticate, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave request not found",
            });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({
                message: "Leave has already been processed",
            });
        }

        leave.status = "Rejected";

        await leave.save();

        res.json({
            message: "Leave rejected successfully",
            leave,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to reject leave",
            error: error.message,
        });
    }
});

module.exports = router;