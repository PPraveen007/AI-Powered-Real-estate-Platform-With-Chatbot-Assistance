import mongoose from "mongoose";

const listingschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        propertyType: {
            type: String,
            required: true,
        },
        subType: {
            type: String,
            required: true,
        },
        subSubType: {
            type: String,
        },
        minPrice: {
            type: Number,
            required: true,
        },
        maxPrice: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        furnished: {
            type: Boolean,
            required: true,
        },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        balcony: {
            type: Boolean,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        
        type: {         //rent or sale
            type: String,
            required: true,
        },
        // offer: {
        //     type: Boolean,
        //     required: true,
        // },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: { //which user created this listing
            type: String,
            required: true,
        },
        userIdCard: { 
            type: String,
            required: true,
        },
        status: { //active or inactive
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
            required: true,
        },
        comment:{
            type: String,
        }
    }, 
    {timestamps: true} //save these true data's
);


//creating a model
const Listing = mongoose.model("Listing", listingschema);

export default Listing;

