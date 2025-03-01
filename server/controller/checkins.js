import { db } from "../database/db_config.js";

export const checkins = (req, res) => {
  try {
    const { ticket_id,event_id} = req.params;

    if (!ticket_id || !event_id) {
      return res.status(400).json({ message: "Input field is missing" });
    }

    const insertCheckinsQuery =
      "INSERT INTO checkins(`ticket_id`, `event_id`) VALUES (?, ?)";

    db.query(
      insertCheckinsQuery,
      [ticket_id, event_id],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        console.log("Inserted Data:", result);
        res
          .status(200)
          .json({ message: "Data inserted successfully", data: result });
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ message: "Unexpected error", error });
  }
};
