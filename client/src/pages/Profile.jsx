// src/pages/Profile.jsx
// (Keep existing imports and logic)
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserFailure, // Make sure to import failure for signout
  signOutUserSuccess, // Make sure to import success for signout
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsFetched, setListingsFetched] = useState(false); // Track if listings have been fetched at least once
  const dispatch = useDispatch();

  // --- Existing useEffect for file upload ---
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // Existing file upload logic...
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error("Upload Error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at:", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false); // Reset error on success
          setFilePerc(100); // Ensure it shows 100%
        });
      }
    );
  };

  // --- Existing handleChange ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- Existing handleSubmit for profile update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false); // Reset success message on new submit
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      // Clear percentage and error after successful update if desired
      // setFilePerc(0);
      // setFileUploadError(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // --- Existing handleDeleteUser ---
  const handleDeleteUser = async () => {
    // Add a confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      // User will be logged out/redirected automatically by Redux state change typically
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // --- Existing handleSignOut ---
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout"); // Assuming this is a GET request based on your code
      const data = await res.json();
      if (data.success === false) {
        // Use signOutUserFailure here
        dispatch(signOutUserFailure(data.message));
        return;
      }
      // Use signOutUserSuccess here (ensure it's imported and handles state correctly)
      dispatch(signOutUserSuccess(data));
      // No need to dispatch deleteUserSuccess on signout
    } catch (error) {
      // Use signOutUserFailure here
      dispatch(signOutUserFailure(error.message));
    }
  };

  // --- Existing handleShowListings ---
  const handleShowListings = async () => {
    // If listings are already fetched and there was no error, don't fetch again (optional optimization)
    // if (listingsFetched && !showListingsError) return;

    try {
      setShowListingsError(false);
      setListingsFetched(false); // Indicate loading state maybe?

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        setUserListings([]); // Clear listings on error
      } else {
        // Ensure data is always an array, even if API returns single object or nothing
        setUserListings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setShowListingsError(true);
      setUserListings([]); // Clear listings on catch error
      console.error("Error fetching listings:", error);
    } finally {
      setListingsFetched(true); // Mark as fetched regardless of outcome
    }
  };

  // --- Existing handleDeleteListings ---
  const handleDeleteListings = async (listingId) => {
    // Add confirmation
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.error("Delete listing error:", data.message);
        // Maybe show an alert to the user
        alert(`Error deleting listing: ${data.message}`);
        return;
      }
      // Update state to remove the deleted listing
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      alert("Listing deleted successfully.");
    } catch (error) {
      console.error("Delete listing exception:", error.message);
      alert(`Error deleting listing: ${error.message}`);
    }
  };

  // --- Return JSX ---
  return (
    // Apply padding top similar to Home to avoid overlap with fixed header
    <div className="p-3 max-w-lg mx-auto pt-24 pb-12">
      <h1 className="text-3xl font-semibold text-center my-7 text-slate-700">
        {" "}
        Your Profile{" "}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File Input and Image Preview */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar} // Use optional chaining
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-4 border-slate-300 hover:border-blue-400 transition-all"
          onError={(e) => {
            // More robust fallback
            e.target.src =
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
            e.target.onerror = null;
          }}
        />
        {/* Upload Status/Error Message */}
        <p className="text-center text-sm">
          {/* Use more descriptive error messages */}
          {fileUploadError ? (
            <span className="text-red-600 font-medium">
              Image upload failed. (Check size &lt; 2MB & type)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-600"> {`Uploading ${filePerc}%`} </span>
          ) : filePerc === 100 && !fileUploadError && formData.avatar ? ( // Check formData.avatar updated
            <span className="text-green-600 font-medium">
              Image successfully uploaded!
            </span>
          ) : (
            ""
          )}
        </p>

        {/* Input Fields - Add subtle focus styles */}
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser?.username}
          id="username"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          id="email"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="New Password (leave blank to keep current)" // Improved placeholder
          id="password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />

        {/* Update Button - Use theme colors */}
        <button
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg p-3 uppercase hover:bg-blue-700 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Create Listing Button - Use theme colors */}
        <Link
          className="bg-green-600 text-white rounded-lg p-3 uppercase text-center hover:bg-green-700 transition duration-300"
          to={"/create-listing"}
        >
          Create New Listing
        </Link>
      </form>

      {/* Action Links */}
      <div className="flex justify-between mt-5 text-sm">
        <span
          onClick={handleDeleteUser}
          className="text-red-600 cursor-pointer hover:underline font-medium"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer hover:underline font-medium"
        >
          Sign Out
        </span>
      </div>

      {/* Feedback Messages */}
      <p className="text-red-600 mt-5 text-center font-medium">
        {error ? `Error: ${error}` : ""}{" "}
      </p>
      <p className="text-green-600 mt-5 text-center font-medium">
        {updateSuccess ? "Profile updated successfully!" : ""}
      </p>

      {/* Show Listings Section */}
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full mt-6 font-medium hover:underline"
      >
        {userListings.length > 0 ? "Hide My Listings" : "Show My Listings"}{" "}
        {/* Toggle text maybe? Or just "Show/Refresh" */}
      </button>
      <p className="text-red-600 mt-3 text-center">
        {showListingsError ? "Error showing listings. Please try again." : ""}
      </p>

      {/* Display User Listings */}
      {listingsFetched && !showListingsError && userListings.length === 0 && (
        <p className="text-gray-600 text-center mt-5">
          You have not created any listings yet.
        </p>
      )}

      {listingsFetched && userListings.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-center mt-4 font-semibold text-2xl text-slate-700 flex justify-center items-center">
            Your Listings
            {/* Simple animation */}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="ml-3 text-slate-600 mt-1"
            >
              <FaArrowRightLong />
            </motion.span>
          </h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-md transition-shadow bg-white"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain rounded"
                  loading="lazy"
                />
              </Link>

              <Link
                className="font-semibold text-slate-700 hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p className="truncate">{listing.name}</p>
                {/* Display Status More Clearly */}
                <p
                  style={{ fontSize: 13, marginTop: 4 }}
                  className={`font-medium ${
                    listing.status === "APPROVED"
                      ? "text-green-600"
                      : listing.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600" // Pending or other statuses
                  }`}
                >
                  Status: {listing.status || "PENDING"}{" "}
                  {/* Default to PENDING if status is null/undefined */}
                </p>
              </Link>

              <div className="flex flex-col items-center gap-1 text-sm">
                <button
                  onClick={() => handleDeleteListings(listing._id)}
                  className="text-red-600 uppercase font-medium hover:text-red-800"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase font-medium hover:text-green-800">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
