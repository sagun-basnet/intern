import { db } from "../database/db_config.js";
import bcrypt from "bcryptjs";

export const users = (req, res) => {
  try {
    const { name, email, password, type, phone } = req.body;

    if (!name || !email || !password || !type || !phone) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields!" });
    }

    // Check if user already exists
    const userCheckQuery = "SELECT * FROM users WHERE email = ? OR phone = ?";
    db.query(userCheckQuery, [email, phone], (err, existingUsers) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (existingUsers.length > 0) {
        return res
          .status(400)
          .json({ message: "Email or Phone number is already in use" });
      }

      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds); 

     
      const userInsertQuery = `INSERT INTO users (name, email, hashedPassword, role, phone) VALUES (?, ?, ?, ?, ?)`;
      db.query(
        userInsertQuery,
        [name, email, hashedPassword, type, phone],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res
              .status(500)
              .json({ message: "Database error", error: err.message });
          }

          console.log("Inserted Data:", result);
          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};

// Get single user by ID
export const getUserId = (req, res) => {
  try {
    const { id } = req.params;
    console.log("User ID is:", id);

    const userQuery = "SELECT * FROM users WHERE user_id = ?";
    db.query(userQuery, [id], (err, rows) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user: rows[0] });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};
//Get all users
export const getAllUsers = (req, res) => {
  try {
    const query = "SELECT user_id, name, email, role, phone FROM users"; 
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      res.status(200).json({ users: rows });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};

// update users
export const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, type } = req.body;

    if (!name || !email || !phone || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query = `UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE user_id = ?`;
    db.query(query, [name, email, phone, type, id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};
//Delete Users
export const deleteUser = (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM users WHERE user_id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};
