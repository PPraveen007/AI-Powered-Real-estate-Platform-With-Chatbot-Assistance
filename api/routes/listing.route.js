import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings, getPendingListings, approveListing, rejectListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
router.get("/pending", getPendingListings);

router.put('/approve/:id',approveListing)
router.post('/reject/:id',rejectListing)

export default router;
