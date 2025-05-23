import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdOutlineBed, MdOutlineBathtub } from "react-icons/md";

export default function ListingItem({ listing }) {
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const isOffer = listing.offer === true;

  return (
    <div
      className="group relative bg-white shadow-md hover:shadow-xl transition-shadow overflow-hidden rounded-lg sm:w-[300px] w-full flex flex-col" // Added fixed width
    >
      <Link to={`/listing/${listing._id}`} className="block">
        <img
          src={listing.imageUrls[0] || "/placeholder-listing.jpg"}
          alt={listing.name || "Listing image"}
          className="h-[200px] w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" // Adjusted image height
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-listing.jpg";
            e.target.onerror = null;
          }}
        />
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-grow w-full">
        <Link to={`/listing/${listing._id}`} className="block">
          <p className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {listing.name || "Untitled Listing"}
          </p>
        </Link>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MdLocationOn className="h-4 w-4 text-green-700 flex-shrink-0" />
          <p className="truncate">
            {[listing.street, listing.city, listing.state, listing.pincode]
              .filter((part) => part)
              .join(", ") || "Address not specified"}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description || "No description available."}
        </p>
        <p className="mt-1 text-slate-700 font-semibold">
          {formatPrice(listing.minPrice)}
          {listing.maxPrice && listing.maxPrice !== listing.minPrice
            ? ` - ${formatPrice(listing.maxPrice)}`
            : ""}
          {listing.type === "rent" && (
            <span className="text-xs font-normal"> / month</span>
          )}
        </p>
        {listing.propertyType === "Residential" && (
          <div className="text-slate-700 flex items-center gap-4 mt-1">
            {typeof listing.bedrooms === "number" && listing.bedrooms > 0 && (
              <div className="flex items-center gap-1 font-medium text-xs">
                <MdOutlineBed className="text-lg text-gray-600" />
                <span>
                  {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                </span>
              </div>
            )}
            {typeof listing.bathrooms === "number" && listing.bathrooms > 0 && (
              <div className="flex items-center gap-1 font-medium text-xs">
                <MdOutlineBathtub className="text-lg text-gray-600" />
                <span>
                  {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {listing.type && (
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded shadow-sm ${
            listing.type === "rent"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      )}

      {isOffer && (
        <span className="absolute top-9 right-2 text-xs font-semibold px-2 py-1 rounded shadow-sm bg-red-100 text-red-800">
          {/* Special Offer */}
        </span>
      )}
    </div>
  );
}
