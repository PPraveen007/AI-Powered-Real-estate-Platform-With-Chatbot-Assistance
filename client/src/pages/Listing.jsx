import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { MdBalcony } from "react-icons/md";
import ContactForm from "../components/Contact"; // Import the new ContactForm component

export default function Listing() {
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false); // State to control the visibility of the contact form
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        console.log("API response:", data);

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="max-w-6xl mx-auto p-4">
      {loading && <p className="text-center my-7 text-2xl">Loading..</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="px-4 sm:px-6 lg:px-8 pt-12 max-w-5xl mx-auto">

          <div className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out relative">
            <Swiper
              navigation
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              className="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-full w-full relative"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {listing && listing.imageUrls && listing.imageUrls.length > 0 && (
              <div className="absolute top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white bg-opacity-80 hover:bg-opacity-100 cursor-pointer transition duration-300 ease-in-out">
                <FaShare
                  className="text-slate-700 hover:text-slate-900"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
              </div>
            )}
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-green-500 text-white p-2 shadow-md">
                Link copied!
              </p>
            )}
            <div className="p-5">
              <p className="text-3xl font-extrabold text-gray-900 mb-2">
                {listing.name}
              </p>
              <div
                className="flex items-center mb-4 cursor-pointer"
                onClick={() => {
                  const address = `${listing.street}, ${listing.city}, ${listing.state} ${listing.pincode}`;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    address
                  )}`;
                  window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <FaMapMarkerAlt className="text-green-700 mr-2" />
                <p className="text-gray-700 text-sm">
                  {listing.street}, {listing.city}, {listing.state} -{" "}
                  {listing.pincode}
                </p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-red-900">
                  ₹{listing.minPrice.toLocaleString("en-IN")} - ₹
                  {listing.maxPrice.toLocaleString("en-IN")}
                  {listing.type === "rent" && (
                    <span className="text-sm text-gray-600"> / month</span>
                  )}
                </p>
                <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
              </div>
              {listing.comment !== "" && listing.status === "REJECTED" && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <strong className="font-bold">Rejection Reason:</strong>
                  <span className="block sm:inline">{listing.comment}</span>
                </div>
              )}
              <p className="text-gray-800 leading-relaxed mb-4">
                <span className="font-semibold text-gray-900">
                  Description:
                </span>{" "}
                {listing.description}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                {listing.propertyType === "Residential" && (
                  <>
                    <li className="flex items-center">
                      <FaBed className="mr-2 text-lg text-blue-500" />
                      {listing.bedrooms > 1
                        ? `${listing.bedrooms} beds`
                        : `${listing.bedrooms} bed`}
                    </li>
                    <li className="flex items-center">
                      <FaBath className="mr-2 text-lg text-blue-500" />
                      {listing.bathrooms > 1
                        ? `${listing.bathrooms} baths`
                        : `${listing.bathrooms} bath`}
                    </li>
                    <li className="flex items-center">
                      <FaParking className="mr-2 text-lg text-blue-500" />
                      {listing.parking ? "Parking Spot" : "No Parking"}
                    </li>
                    <li className="flex items-center">
                      <FaChair className="mr-2 text-lg text-blue-500" />
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </li>
                    <li className="flex items-center">
                      <MdBalcony className="mr-2 text-lg text-blue-500" />
                      {listing.balcony ? "Balcony" : "No Balcony"}
                    </li>
                  </>
                )}
              </ul>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mt-6"
                  >
                    Contact Landlord
                  </button>
                )}
              {contact && listing && (
                <ContactForm
                  listing={{ ...listing, landlordEmail: listing.landlordEmail }} // Assuming landlordEmail is in your listing data
                  onClose={() => setContact(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
