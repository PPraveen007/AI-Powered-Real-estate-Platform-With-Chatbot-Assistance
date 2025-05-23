import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem"; // Ensure this path is correct
import { Element } from "react-scroll";
import { AboutContent } from "./AboutContent"; // Ensure this path is correct
import { FiArrowRight } from "react-icons/fi"; // Import the arrow icon

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch Offers
        const offerRes = await fetch("/api/listing/get?offer=true&limit=4"); // Fetch only 4 for the preview
        const offerData = await offerRes.json();
        if (Array.isArray(offerData)) {
          setOfferListings(offerData);
        }

        // Fetch Rent
        const rentRes = await fetch("/api/listing/get?type=rent&limit=4"); // Fetch only 4 for the preview
        const rentData = await rentRes.json();
        if (Array.isArray(rentData)) {
          setRentListings(rentData);
        }

        // Fetch Sale
        const saleRes = await fetch("/api/listing/get?type=sale&limit=4"); // Fetch only 4 for the preview
        const saleData = await saleRes.json();
        if (Array.isArray(saleData)) {
          setSaleListings(saleData);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
    fetchListings();
  }, []);

  return (
    // Use `pt-16` or similar based on your actual fixed Header height
    <main className="pt-16">
      {/* --- Hero Section --- */}
      <Element name="home-hero">
        <div className="relative text-white py-32 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-slate-800 to-slate-600">
          <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
          {/* Overlay */}
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
              Find Your <span className="text-blue-400">Dream Property</span>
              <br />
              With Smart<span className="text-blue-400">Estate</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-lg sm:text-xl text-slate-200 mb-8">
              Discover curated listings for sale and rent. Your perfect home is
              just a click away. Explore offers, find rentals, or secure your
              next investment.
            </p>
            <Link
              to={"/search"}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </Element>

      {/* --- Swiper for featured/offer listings --- */}
      {/* Only render Swiper if there are offer listings */}
      {offerListings && offerListings.length > 0 && (
        <Swiper
          navigation
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              {/* Link the whole slide for better UX */}
              <Link
                to={`/listing/${listing._id}`}
                className="block w-full h-full"
              >
                <div
                  style={{
                    backgroundImage: `url(${
                      listing.imageUrls[0] || "/placeholder-listing.jpg"
                    })`, // Added fallback image
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  className="h-[350px] sm:h-[450px] lg:h-[550px] w-full relative" // Added relative for potential content overlay later
                  onError={(e) => {
                    e.target.style.backgroundImage =
                      "url(/placeholder-listing.jpg)";
                  }} // Fallback for background
                >
                  {/* Optional: Overlay content on Swiper slide if needed */}
                  {/* <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">
                         <h3 className="text-xl font-semibold">{listing.name}</h3>
                         </div> */}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* --- Listings Sections --- */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-2">
        {/* --- Recent Offers Section --- */}
        {offerListings && offerListings.length > 0 && (
          <section>
            {/* Section Header */}
            <div className="mb-5 flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700">
                Exclusive Offers
              </h2>
              {/* Updated "Show more" Link */}
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out font-medium inline-flex items-center group"
                to={"/search?offer=true"}
              >
                Show more offers
                <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* **UPDATED LAYOUT**: Use flex wrap and gap */}
            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* --- Recent Rentals Section --- */}
        {rentListings && rentListings.length > 0 && (
          <section>
            {/* Section Header */}
            <div className="mb-5 flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700">
                Places for Rent
              </h2>
              {/* Updated "Show more" Link */}
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out font-medium inline-flex items-center group"
                to={"/search?type=rent"}
              >
                Show more rentals
                <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* **UPDATED LAYOUT**: Use flex wrap and gap */}
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* --- Recent Sales Section --- */}
        {saleListings && saleListings.length > 0 && (
          <section>
            {/* Section Header */}
            <div className="mb-5 flex justify-between items-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700">
                Properties for Sale
              </h2>
              {/* Updated "Show more" Link */}
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out font-medium inline-flex items-center group"
                to={"/search?type=sale"}
              >
                Show more for sale
                <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* **UPDATED LAYOUT**: Use flex wrap and gap */}
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* --- About Section --- */}
      {/* **UPDATED STYLING**: Added gradient background and more padding */}
      <Element
        name="about-section"
        // className="bg-gradient-to-br from-slate-50 to-blue-100 py-6 sm:py-10 lg:py-28"
      >
        <AboutContent />
      </Element>
    </main>
  );
}
