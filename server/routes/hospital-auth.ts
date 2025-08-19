import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const router = express.Router();

// Get all countries, states, cities, and hospitals for location-based login
router.get("/locations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        country,
        state,
        city,
        hospital_id,
        name as hospital_name
      FROM hospitals
      WHERE status = 'active'
      ORDER BY country, state, city, name
    `);

    // Group data hierarchically
    const locations: any = {};

    result.rows.forEach((row) => {
      const { country, state, city, hospital_id, hospital_name } = row;

      if (!locations[country]) {
        locations[country] = {};
      }
      if (!locations[country][state]) {
        locations[country][state] = {};
      }
      if (!locations[country][state][city]) {
        locations[country][state][city] = [];
      }

      locations[country][state][city].push({
        id: hospital_id,
        name: hospital_name,
      });
    });

    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch locations",
    });
  }
});

// Hospital login
router.post("/login", async (req, res) => {
  try {
    const { hospital_id, password } = req.body;

    if (!hospital_id || !password) {
      return res.status(400).json({
        success: false,
        error: "Hospital ID and password are required",
      });
    }

    // Find hospital by ID
    const result = await pool.query(
      "SELECT * FROM hospitals WHERE hospital_id = $1 AND status = 'active'",
      [hospital_id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Hospital ID not found or inactive",
      });
    }

    const hospital = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, hospital.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid password. Please check your credentials and try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        hospital_id: hospital.hospital_id,
        hospital_name: hospital.name,
        email: hospital.email,
        city: hospital.city,
        country: hospital.country,
      },
      process.env.JWT_SECRET || "hospital-secret",
      { expiresIn: "24h" },
    );

    // Return hospital info without password
    const { password: hospitalPassword, ...hospitalInfo } = hospital;

    res.json({
      success: true,
      token,
      hospital: hospitalInfo,
    });
  } catch (error) {
    console.error("Hospital login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// Verify hospital token
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "hospital-secret",
    ) as any;

    // Get updated hospital info
    const result = await pool.query(
      "SELECT * FROM hospitals WHERE hospital_id = $1 AND status = 'active'",
      [decoded.hospital_id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Hospital not found",
      });
    }

    const { password: hospitalPassword, ...hospitalInfo } = result.rows[0];

    res.json({
      success: true,
      hospital: hospitalInfo,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { hospital_id, email } = req.body;

    if (!hospital_id || !email) {
      return res.status(400).json({
        success: false,
        error: "Hospital ID and email are required",
      });
    }

    // Verify hospital exists
    const hospitalResult = await pool.query(
      "SELECT hospital_id, email FROM hospitals WHERE hospital_id = $1 AND email = $2 AND status = 'active'",
      [hospital_id, email],
    );

    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Hospital not found with provided ID and email",
      });
    }

    // Generate unique request ID
    const request_id = `PWD_REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create password reset request
    await pool.query(
      `INSERT INTO password_reset_requests (request_id, hospital_id, requested_by_email) 
       VALUES ($1, $2, $3)`,
      [request_id, hospital_id, email],
    );

    // Create notification for admin
    const notification_id = `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await pool.query(
      `INSERT INTO notifications (notification_id, hospital_id, type, title, message, related_id) 
       VALUES ($1, 'ADMIN', 'password_reset_request', 'Password Reset Request', 
               'Hospital ${hospital_id} has requested password reset', $2)`,
      [notification_id, request_id],
    );

    res.json({
      success: true,
      message: "Password reset request sent to admin for approval",
      request_id,
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process password reset request",
    });
  }
});

export default router;
