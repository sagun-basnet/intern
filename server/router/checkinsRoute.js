import express from "express";
import {checkins,getAllCheckins}from "../controller/checkins.js";

const routes = express.Router();
routes.post("/checkins/:ticket_id/:bid",checkins);
routes.get("/getCheckins",getAllCheckins);

export default routes;