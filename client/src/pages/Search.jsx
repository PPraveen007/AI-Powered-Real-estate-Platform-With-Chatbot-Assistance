import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function Search() {
  const PRICE_MIN = 0;
  const PRICE_MAX = 10000000;
  const PRICE_STEP = 50000;

  const navigate = useNavigate();
  // const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    rent: false,
    sale: false,
    all: true,
    city: "",
    propertyType: "",
    subType: "",
    subSubType: "",
    minPrice: PRICE_MIN,
    maxPrice: PRICE_MAX,
    parking: false,
    furnished: false,
    balcony: false,
    offer: false,
    order: "desc", // Assuming a default order, though UI for this is missing
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(true);

  // State for the slider values specifically, initialized from sidebardata
  const [values, setValues] = useState([
    sidebardata.minPrice,
    sidebardata.maxPrice,
  ]);

  // --- Price Range Slider & Dropdown Handlers ---
  const handlePriceChange = (newValues) => {
    setValues(newValues);
    // Update sidebardata debounce or on form submit for performance if needed
    setSidebardata((prev) => ({
      ...prev,
      minPrice: newValues[0],
      maxPrice: newValues[1],
    }));
  };

  const handleMinPriceDropdownChange = (event) => {
    const newMinPrice = Number(event.target.value);
    // Ensure minPrice does not exceed current maxPrice
    const effectiveMaxPrice = values[1];
    const finalMinPrice =
      newMinPrice <= effectiveMaxPrice ? newMinPrice : effectiveMaxPrice;

    setValues([finalMinPrice, effectiveMaxPrice]);
    setSidebardata((prev) => ({ ...prev, minPrice: finalMinPrice }));
  };

  const handleMaxPriceDropdownChange = (event) => {
    const newMaxPrice = Number(event.target.value);
    // Ensure maxPrice is not less than current minPrice
    const effectiveMinPrice = values[0];
    const finalMaxPrice =
      newMaxPrice >= effectiveMinPrice ? newMaxPrice : effectiveMinPrice;

    setValues([effectiveMinPrice, finalMaxPrice]);
    setSidebardata((prev) => ({ ...prev, maxPrice: finalMaxPrice }));
  };

  // Generate price options for dropdowns
  const priceOptions = [];
  // Add the max price to the options if it's not already a multiple of the step
  const effectiveMaxForDropdown =
    PRICE_MAX % PRICE_STEP !== 0 ? PRICE_MAX : PRICE_MAX - PRICE_STEP;

  for (let i = PRICE_MIN; i <= effectiveMaxForDropdown; i += PRICE_STEP) {
    priceOptions.push(i);
  }
  // Ensure the absolute maximum is always an option
  if (!priceOptions.includes(PRICE_MAX)) {
    priceOptions.push(PRICE_MAX);
  }
  // Sort options numerically
  priceOptions.sort((a, b) => a - b);

  // --- SubSubType Options ---
  const subSubTypeOptions = {
    Office: [
      "Ready to Move Space",
      "Bare Shell Office Space",
      "Co-working Space",
      "Business Center",
    ],
    Retail: ["Showrooms", "Shops"],
    "Plots/ Land": [
      "Commercial Land",
      "Agricultural Land",
      "Industrial Land/ Plots",
    ], // Corrected key to match select value
    Storage: ["Warehouse", "Cold Storage", "Self Storage"],
    Industry: ["Factory", "Manufacturing"],
    Hospitality: ["Hotel/ Resort", "Banquet Halls", "Guest House"],
    "Apartment/Flat": ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
    // Add subtypes for residential if needed, though subsubtypes might be less common here
    "Independent House/ Villa": [], // Example if no sub-subtypes
    "Builder Floor": [],
    "PG/Co-Living": [],
    "1 RK/ Studio Apartment": [],
    "Serviced Apartment": [],
    Farmhouse: [],
    Other: [], // Handle 'Other' case
  };

  // --- Effect to parse URL and fetch listings ---
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const cityFromUrl = urlParams.get("city");
    const propertyTypeFromUrl = urlParams.get("propertyType");
    const subTypeFromUrl = urlParams.get("subType");
    const subSubTypeFromUrl = urlParams.get("subSubType");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const balconyFromUrl = urlParams.get("balcony");
    const minPriceFromUrl = urlParams.get("minPrice");
    const maxPriceFromUrl = urlParams.get("maxPrice");
    const offerFromUrl = urlParams.get("offer");
    const orderFromUrl = urlParams.get("order");

    const parsedSidebardata = {
      searchTerm: searchTermFromUrl || "",
      type: typeFromUrl || "all",
      city: cityFromUrl || "", // Keep city blank by default if not in URL
      propertyType: propertyTypeFromUrl || "all",
      subType: subTypeFromUrl || "", // Keep subtype blank by default
      subSubType: subSubTypeFromUrl || "", // Keep subsubtype blank by default
      parking: parkingFromUrl === "true", // Correctly parse boolean
      furnished: furnishedFromUrl === "true", // Correctly parse boolean
      balcony: balconyFromUrl === "true", // Correctly parse boolean
      offer: offerFromUrl === "true", // Correctly parse boolean
      minPrice: minPriceFromUrl ? Number(minPriceFromUrl) : PRICE_MIN,
      maxPrice: maxPriceFromUrl ? Number(maxPriceFromUrl) : PRICE_MAX,
      order: orderFromUrl || "desc",
    };

    setSidebardata(parsedSidebardata);
    // Initialize the slider values from the parsed data
    setValues([parsedSidebardata.minPrice, parsedSidebardata.maxPrice]);

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        // if (data.length > 8) {
        //   // Check if more items might exist (assuming page size 9)
        //   setShowMore(true);
        // } else {
        //   setShowMore(false);
        // }
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        // Optionally display an error message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]); // Depend on location.search to refetch when URL changes

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    // Handle type checkboxes
    if (id === "all" || id === "rent" || id === "sale") {
      if (id === "all") {
        setSidebardata({ ...sidebardata, type: "all" });
      } else if (id === "rent") {
        setSidebardata({ ...sidebardata, type: checked ? "rent" : "all" });
      } else if (id === "sale") {
        setSidebardata({ ...sidebardata, type: checked ? "sale" : "all" });
      }
    }

    // Handle other inputs (text, select)
    if (
      ["searchTerm", "city", "propertyType", "subType", "subSubType"].includes(
        id
      )
    ) {
      let updatedData = { ...sidebardata, [id]: value };

      // Reset subtype and subsubtype if propertyType changes
      if (id === "propertyType" && value !== sidebardata.propertyType) {
        updatedData.subType = "";
        updatedData.subSubType = "";
      }
      // Reset subsubtype if subType changes
      if (id === "subType" && value !== sidebardata.subType) {
        updatedData.subSubType = "";
      }

      setSidebardata(updatedData);
    }

    // Handle amenity checkboxes (parking, furnished, balcony)
    if (["parking", "furnished", "balcony"].includes(id)) {
      setSidebardata({
        ...sidebardata,
        [id]: checked, // Checked is already a boolean
      });
    }

    // Handle sort order (if you add a dropdown/selector for it)
    if (id === "order") {
      setSidebardata({ ...sidebardata, order: value });
    }
  };

  // --- Handle Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("city", sidebardata.city);
    urlParams.set("propertyType", sidebardata.propertyType);
    urlParams.set("subType", sidebardata.subType);
    urlParams.set("subSubType", sidebardata.subSubType);
    urlParams.set("parking", sidebardata.parking.toString());
    urlParams.set("furnished", sidebardata.furnished.toString());
    urlParams.set("balcony", sidebardata.balcony.toString());
    urlParams.set("minPrice", sidebardata.minPrice.toString());
    urlParams.set("maxPrice", sidebardata.maxPrice.toString());
    urlParams.set("offer", sidebardata.offer.toString());
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // --- Show More Button Handler ---
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    setLoading(true); // Optional: Show loading for "Show More"
    try {
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(false);
      setListings([...listings, ...data]); // Append new listings
    } catch (error) {
      console.error("Failed to fetch more listings:", error);
      // Optionally display an error message
    } finally {
      setLoading(false); // Hide loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 pt-20 min-h-screen">
      {" "}
      {/* Added background and padding */}
      {/* --- Sidebar (Filters) --- */}
      <div className="p-6 border-b md:border-r md:min-h-screen md:w-96 bg-white shadow-lg md:shadow-none md:rounded-none rounded-lg mx-4 md:mx-0 mb-6 md:mb-0">
        {" "}
        {/* Enhanced styling, fixed width */}
        <div className="lg:sticky lg:top-24 p-3">
          {" "}
          {/* Adjusted sticky position */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {" "}
            {/* Adjusted gap */}
            {/* Search Term */}
            <div className="flex items-center gap-3">
              {" "}
              {/* Adjusted gap */}
              <label className="whitespace-nowrap font-semibold text-gray-700">
                Search:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Keywords, location..." // More descriptive placeholder
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" // Enhanced input styling
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            {/* Property Type */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Property Type:
              </label>
              <select
                id="propertyType"
                onChange={handleChange}
                value={sidebardata.propertyType}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            {/* Subtype */}
            {(sidebardata.propertyType === "residential" ||
              sidebardata.propertyType === "commercial") && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Subtype:</label>
                <select
                  id="subType"
                  onChange={handleChange}
                  value={sidebardata.subType}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Any Subtype</option> {/* Changed label */}
                  {sidebardata.propertyType === "residential" && (
                    <>
                      <option value="Apartment/Flat">Apartment/Flat</option>
                      <option value="Independent House/ Villa">
                        Independent House/ Villa
                      </option>{" "}
                      {/* Corrected value */}
                      <option value="Builder Floor">Builder Floor</option>
                      <option value="PG/Co-Living">PG/Co-Living</option>
                      <option value="1 RK/ Studio Apartment">
                        1 RK/ Studio Apartment
                      </option>
                      <option value="Serviced Apartment">
                        Serviced Apartment
                      </option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Other">Other Residential</option>{" "}
                      {/* Clarified 'Other' */}
                    </>
                  )}
                  {sidebardata.propertyType === "commercial" && (
                    <>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                      <option value="Plots/ Land">Plots/ Land</option>{" "}
                      {/* Corrected value */}
                      <option value="Storage">Storage</option>
                      <option value="Industry">Industry</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Other">Other Commercial</option>{" "}
                      {/* Clarified 'Other' */}
                    </>
                  )}
                </select>
              </div>
            )}
            {/* SubSubtype (Conditionally Rendered) */}
            {sidebardata.subType &&
              subSubTypeOptions[sidebardata.subType] &&
              subSubTypeOptions[sidebardata.subType].length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">
                    SubSubtype:
                  </label>
                  <select
                    id="subSubType"
                    onChange={handleChange}
                    value={sidebardata.subSubType}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Any SubSubtype</option>{" "}
                    {/* Changed label */}
                    {subSubTypeOptions[sidebardata.subType].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            {/* Transaction Type (Rent/Sale/All/Offer) */}
            <div className="flex flex-col gap-2">
              {" "}
              {/* Changed to flex-col for better layout */}
              <label className="font-semibold text-gray-700">
                Transaction Type:
              </label>
              <div className="flex flex-wrap items-center gap-4">
                {" "}
                {/* Adjusted gap */}
                {/* Checkbox for 'All' */}
                <div className="flex items-center gap-1">
                  {" "}
                  {/* Adjusted gap */}
                  <input
                    type="checkbox"
                    id="all"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" // Styled checkbox
                    onChange={handleChange}
                    checked={sidebardata.type === "all"}
                  />
                  <label
                    htmlFor="all"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Rent & Sale
                  </label>{" "}
                  {/* Added label and ml-1 */}
                </div>
                {/* Checkbox for 'Rent' */}
                <div className="flex items-center gap-1">
                  {" "}
                  {/* Adjusted gap */}
                  <input
                    type="checkbox"
                    id="rent"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" // Styled checkbox
                    onChange={handleChange}
                    checked={sidebardata.type === "rent"}
                  />
                  <label
                    htmlFor="rent"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Rent
                  </label>{" "}
                  {/* Added label and ml-1 */}
                </div>
                {/* Checkbox for 'Sale' */}
                <div className="flex items-center gap-1">
                  {" "}
                  {/* Adjusted gap */}
                  <input
                    type="checkbox"
                    id="sale"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" // Styled checkbox
                    onChange={handleChange}
                    checked={sidebardata.type === "sale"}
                  />
                  <label
                    htmlFor="sale"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Sale
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">City:</label>
              <input
                type="text"
                id="city"
                placeholder="e.g., Mumbai"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={sidebardata.city}
                onChange={handleChange}
              />
            </div>
            {/* Amenities */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Amenities:</label>
              <div className="flex flex-wrap items-center gap-4">
                {" "}
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="parking"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <label
                    htmlFor="parking"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Parking
                  </label>
                </div>
                {/* Furnished */}
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <label
                    htmlFor="furnished"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Furnished
                  </label>
                </div>
                {/* Balcony */}
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="balcony"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    onChange={handleChange}
                    checked={sidebardata.balcony}
                  />
                  <label
                    htmlFor="balcony"
                    className="ml-1 text-gray-600 cursor-pointer"
                  >
                    Balcony
                  </label>
                </div>
                {/* Add more amenities here following the same pattern */}
              </div>
            </div>
            {/* Price Range */}
            <div className="flex flex-col gap-4 mt-4">
              {" "}
              {/* Added margin top */}
              <label className="font-semibold text-gray-700">
                Price Range:{" "}
                <span className="font-normal">
                  ₹{values[0].toLocaleString("en-IN")} – ₹
                  {values[1].toLocaleString("en-IN")}
                </span>{" "}
                {/* Styled price display */}
              </label>
              {/* Custom CSS for Slider - Moved to a style block for simplicity here */}
              <style>
                {`
                  .rc-slider-track { /* Active track */
                    background-color: #3b82f6; /* Tailwind blue-500 */
                    height: 6px; /* Reduced height slightly */
                    border-radius: 3px; /* Rounded corners */
                  }
                  .rc-slider-rail { /* Rail (inactive track) */
                    background-color: #d1d5db; /* Tailwind gray-300 */
                    height: 6px; /* Match active track height */
                    border-radius: 3px; /* Rounded corners */
                  }
                  .rc-slider-handle {
                    width: 18px; /* Adjusted size */
                    height: 18px; /* Adjusted size */
                    margin-top: -6px; /* Adjust vertical position */
                    border-radius: 50%;
                    background-color: #ffffff; /* White handle */
                    border: 2px solid #3b82f6; /* Blue border */
                    cursor: grab;
                    outline: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* More prominent shadow */
                    transition: box-shadow 0.2s ease-in-out;
                  }
                   .rc-slider-handle:hover {
                      box-shadow: 0 3px 8px rgba(0,0,0,0.3); /* Larger shadow on hover */
                   }
                  .rc-slider-handle:active {
                    cursor: grabbing;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.4); /* Even larger shadow when active */
                  }
                  .rc-slider-tooltip-inner { /* Style the tooltip */
                    background-color: #3b82f6;
                    color: white;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 0.875rem; /* text-sm */
                  }
                   .rc-slider-tooltip-arrow { /* Style the tooltip arrow */
                       border-top-color: #3b82f6 !important;
                   }
                   .rc-slider-dot { /* Dots on the slider (if used) */
                        border-color: #d1d5db;
                        background-color: #ffffff;
                        box-shadow: none;
                   }
                   .rc-slider-dot-active {
                       border-color: #3b82f6;
                   }
                `}
              </style>
              <div className="px-1">
                {" "}
                {/* Reduced padding for slider */}
                <Slider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={values}
                  onChange={handlePriceChange}
                  range
                  trackStyle={[
                    { backgroundColor: "#3b82f6" },
                    { backgroundColor: "#3b82f6" },
                  ]} // Apply Tailwind blue explicitly
                  handleStyle={[
                    { borderColor: "#3b82f6" },
                    { borderColor: "#3b82f6" },
                  ]} // Apply Tailwind blue explicitly
                  railStyle={{ backgroundColor: "#d1d5db" }} // Apply Tailwind gray explicitly
                  tooltip={{
                    formatter: (value) => `₹${value.toLocaleString("en-IN")}`, // Custom tooltip format
                  }}
                />
              </div>
              {/* Price Dropdowns */}
              <div className="flex justify-between gap-2 text-sm">
                {" "}
                {/* Adjusted gap */}
                <select
                  className="border border-gray-300 rounded-md p-1.5 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={values[0]}
                  onChange={handleMinPriceDropdownChange}
                >
                  {priceOptions.map((price) => (
                    <option key={price} value={price}>
                      ₹{price.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-md p-1.5 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={values[1]}
                  onChange={handleMaxPriceDropdownChange}
                >
                  {priceOptions.map((price) => (
                    <option key={price} value={price}>
                      ₹{price.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition duration-200 shadow-md mt-6">
              {" "}
              {/* Styled button */}
              Apply Filters
            </button>
          </form>
        </div>
      </div>
      {/* --- Listing Results Area --- */}
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
          Listing Results
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-gray-600 text-center col-span-full">
              {" "}
              {/* Centered message in grid */}
              No listings found matching your criteria.
            </p>
          )}
          {loading && (
            <p className="text-xl text-gray-600 text-center w-full col-span-full">
              {" "}
              {/* Centered loading */}
              Loading...
            </p>
          )}
          {/* Mapping over listings to render ListingItem components */}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
        {/* Show More Button */}
        {showMore && (
          <div className="text-center mt-8">
            {" "}
            {/* Centered button container */}
            <button
              onClick={onShowMoreClick}
              className="text-blue-600 hover:underline font-semibold" // Styled link-like button
            >
              Show More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
