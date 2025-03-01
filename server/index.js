import express from "express";
import routes from "./router/router.js";
import authRoute from "./router/authRoute.js";
import userRoute from "./router/userRoute.js";
import cors from "cors";
import reviewRoute from "./router/reviewRoute.js";
import checkinsRoute from "./router/checkinsRoute.js"

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", routes);
app.use("/api",reviewRoute)
app.use("/api",checkinsRoute)

app.listen(port, (err) => {
  if (err) {
    console.log("Internal server error", err);
  } else {
    console.log("server running on port : ", port);
  }
});
