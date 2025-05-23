import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); //listing exists or not

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Lisitng not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only edit your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Lisitng not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: "PENDING" });
    if (!listings) {
      return next(errorHandler(404, "No pending listings found!"));
    }
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// ...existing code...

export const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Listing has been approved",
      listing: updatedListing,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const rejectListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Optionally capture rejection reason if provided in request body
    const rejectionReason = req.body.comment || "Not specified";

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        comment: rejectionReason,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Listing has been rejected",
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let balcony = req.query.balcony;

    if (balcony === undefined || balcony === "false") {
      balcony = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const propertyTypeFilter =
      req.query.propertyType && req.query.propertyType.toLowerCase() !== "all"
        ? {
          propertyType: {
            $regex: `^${req.query.propertyType}$`,
            $options: "i",
          },
        }
        : {};

    const subTypeFilter =
      req.query.subType && req.query.subType.toLowerCase() !== "all"
        ? { subType: { $regex: `^${req.query.subType}$`, $options: "i" } }
        : {};

    const subSubTypeFilter =
      req.query.subSubType &&
        req.query.subSubType.trim() !== "" &&
        req.query.subSubType.toLowerCase() !== "all"
        ? { subSubType: { $regex: `^${req.query.subSubType}$`, $options: "i" } }
        : {};

    const cityFilter =
      req.query.city && req.query.city.toLowerCase() !== "all"
        ? { city: { $regex: `^${req.query.city}$`, $options: "i" } }
        : {};

    const searchTerm = req.query.searchTerm || "";

    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice
      ? parseInt(req.query.maxPrice)
      : Number.MAX_SAFE_INTEGER;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      furnished,
      balcony,
      parking,
      status: "APPROVED",
      type,
      ...cityFilter,
      ...propertyTypeFilter,
      ...subTypeFilter,
      ...subSubTypeFilter,
      $or: [
        {
          $and: [
            { minPrice: { $gte: minPrice } },
            { maxPrice: { $lte: maxPrice } },
          ],
        },
      ],
    })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
