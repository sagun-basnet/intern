import express from "express";
import { reviews } from "../controller/review.js";
const route =express.Router();

route.post("/reviews/:event_id/:user_id", reviews);

export default route;