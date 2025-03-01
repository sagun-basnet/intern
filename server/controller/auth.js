import { db } from "../database/db_config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  const { name, email, password, role, address, phone } = req.body;
  if (!name || !email || !password || !role || !address || !phone) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields!" });
  }
  const q = "select * from `users` where `email` = ?";
  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists.");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);

    const q =
      "INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      q,
      [name, email, hashedPassword, role, phone, address],
      (err, result) => {
        if (err) return res.status(500).json(err);
        
        return res
          .status(201)
          .json({ message: "User created successfully.", result });
      }
      
    );
    
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM `users` WHERE `email` = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "User Not found." });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("Password not match");

    // Generate JWT token with 1-month expiry
    const token = jwt.sign(
      { id: data[0].id, role: data[0].role },
      "secretkey",
      { expiresIn: "30d" } // Token valid for 30 days
    );

    const { password, ...others } = data[0];

    // Set cookie with 1-month expiry
    res
      .cookie("accessToken", token, {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
      })
      .status(200)
      .json({ others, token });
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken").json({ message: "Logout successfully." });
};
