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
          .json({ message: "Review added successfully", reviews: result });
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

//Get all reviews
export const getAllReviews = (req, res) => {
  try {
    const getAllReviewsQuery = "SELECT * FROM reviews";

    db.query(getAllReviewsQuery, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          message: "An error occurred while fetching reviews.",
          error: err.message,
        });
      }

      res
        .status(200)
        .json({ message: "Reviews retrieved successfully", data: results });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};
// ✅ Get a Single Review by ID
export const getReviewById = (req, res) => {
  try {
    const { review_id } = req.params; // Get review ID from URL

    const getReviewQuery = "SELECT * FROM reviews WHERE review_id = ?";
    db.query(getReviewQuery, [review_id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res
        .status(200)
        .json({ message: "Review retrieved successfully", data: results[0] });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};

//update Review
export const updateReview = (req, res) => {
  try {
    const { id } = req.params; // Get review ID from URL
    const { rating, comment } = req.body; // Get new rating and comment

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

    const updateReviewQuery =
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?";

    db.query(
      updateReviewQuery,
      [rating || null, comment || null, id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err.message });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated successfully" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};

// ✅ Delete a Review
export const deleteReview = (req, res) => {
  try {
    const { id } = req.params; // Get review ID from URL

    const deleteReviewQuery = "DELETE FROM reviews WHERE id = ?";
    db.query(deleteReviewQuery, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error", error: error.message });
  }
};
