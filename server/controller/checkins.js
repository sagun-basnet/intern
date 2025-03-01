import { db } from "../database/db_config.js";

export const checkins = (req, res) => {
  try {
    const { ticket_id, bid } = req.params;
    console.log(bid);

    if (!ticket_id || !bid) {
      return res.status(400).json({ message: "Input field is missing" });
    }

    const insertCheckinsQuery =
      "INSERT INTO checkins(`ticket_id`,`bid`) VALUES (?,?)";

    db.query(insertCheckinsQuery, [ticket_id, bid], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      console.log("Inserted Data:", result);
      res
        .status(200)
        .json({ message: "Data inserted successfully", data: result });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};

//get all checkins

export const getAllCheckins = (req, res) => {
  try {
    const getAllCheckinsQuery = "SELECT * FROM checkins";

    db.query(getAllCheckinsQuery, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res
        .status(200)
        .json({ message: "Check-ins retrieved successfully",  checkins: results });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};
