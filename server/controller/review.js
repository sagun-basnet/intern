import { db } from "../database/db_config.js";

export const reviews = (req, res) => {
  try {
    const { event_id, user_id } = req.params; // Get event_id from URL
    const { rating, comment } = req.body; // Get user_id, rating, and comment from request body

    if (!event_id || !user_id) {
      return res
        .status(401)
        .json({ message: "Event ID and User ID are required fields." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    if (comment && comment.length > 500) {
      return res
        .status(400)
        .json({ message: "Comment must be less than 500 characters." });
    }

    // Handle undefined values
    const sanitizedComment = comment || null;
    const sanitizedRating = rating || null;

    // SQL query to insert a review
    const insertReviewQuery = `INSERT INTO reviews(event_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`;

    db.query(
      insertReviewQuery,
      [event_id, user_id, sanitizedRating, sanitizedComment],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            message: "An error occurred while processing your request.",
            error: err.message,
          });
        }

        console.log("Data inserted successfully", result);
        res
          .status(201)
          .json({ message: "Review added successfully", data: result });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};
