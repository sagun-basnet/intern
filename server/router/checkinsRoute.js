import express from "express";
import {checkins}from "../controller/checkins.js";

const routes = express.Router();
routes.post("/checkins/:ticket_id/:event_id",checkins);

export default routes;