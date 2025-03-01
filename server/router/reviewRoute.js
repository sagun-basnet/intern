import express from "express";
import { reviews,getAllReviews,getReviewById,updateReview,deleteReview } from "../controller/review.js";
const route =express.Router();

route.get("/getReviews",getAllReviews);
route.post("/reviews/:event_id/:user_id", reviews);
route.get("/review/:id",getReviewById);
route.put("updateReview/:id",updateReview);
route.delete("deleteReview/:id",deleteReview);

export default route;