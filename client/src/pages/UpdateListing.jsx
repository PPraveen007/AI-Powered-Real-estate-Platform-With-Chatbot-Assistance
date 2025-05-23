import { useEffect, useState } from "react";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    propertyType: "",
    subType: "",
    subSubType: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    minPrice: 0,
    maxPrice: 0,
    // offer: false,
    parking: false,
    furnished: false,
    balcony: false,
    userIdCard: "", // Add userIdCard field,
    status: "PENDING",
  });

  const residentialSubtypes = [
    "Apartment/Flat",
    "Independent House/ Villa",
    "Builder Floor",
    "PG/Co-Living",
    "1 RK/ Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
    "Other",
  ];
  const commercialSubtypes = [
    "Office",
    "Retail",
    "Plots/ Land",
    "Storage",
    "Industry",
    "Hospitality",
    "Other",
  ];

  const subSubTypeOptions = {
    Office: [
      "Ready to Move Space",
      "Bare Shell Office Space",
      "Co-working Space",
      "Business Center",
    ],
    Retail: ["Showrooms", "Shops"],
    Land: ["Commercial Land", "Agricultural Land", "Industrial Land/ Plots"],
    Storage: ["Warehouse", "Cold Storage", "Self Storage"],
    Industry: ["Factory", "Manufacturing"],
    Hospitality: ["Hotel/ Resort", "Banquet Halls", "Guest House"],
    "Apartment/Flat": ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
  };

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(formData);
  useEffect(() => {
    const fetchListing = async () => {
      //asynchronous function
      const listingId = params.listingId;
      // console.log(listingId);
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing(); //fetched the listing by id
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = []; //more than 1 asynchronous behaviour so we have to wait for all of them (one by one images will be uploaded)

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  // console.log(files);
  const storeImage = async (file) => {
    //as we need to wait

    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "balcony" 
      // e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === "propertyType") {
      setFormData({
        ...formData,
        propertyType: value,
        subType: "",
        subSubType: "",
      });
    }
    if (e.target.id === "subType") {
      setFormData({ ...formData, subType: value, subSubType: "" });
    }
    if (e.target.id === "subSubType") {
      setFormData({ ...formData, subSubType: value, subSubType: "" });
    }
  };

  const fetchAddressDetails = async () => {
    if (!formData.pincode || formData.pincode.length < 6) {
      return alert("Please enter a valid pincode before fetching address.");
    }

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${formData.pincode}`
      );

      if (
        response.data &&
        response.data[0].PostOffice &&
        response.data[0].PostOffice[0]
      ) {
        const place = response.data[0].PostOffice[0];
        const city = place.District;
        const state = place.State;

        setFormData((prev) => ({
          ...prev,
          city: city || "",
          state: state || "",
        }));
      } else {
        alert(
          "Could not fetch city/state from the given pincode. Please fill manually."
        );
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      alert(
        "Failed to fetch address. Please check your pincode or try again later."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 0)
        return setError("You must upload at least one image");
      if (+formData.maxPrice < +formData.minPrice)
        return setError("minimum Price must be lower than maximum Price");

      if (!formData.userIdCard)
        return setError("You must upload an ID card for verification");

      setLoading(true); //remove the previous error
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "PENDING",
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    console.log(formData);
  };

  const handleIdCardUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);
    setError(false);

    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-idcard-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`ID Card upload is ${progress}% done`);
        },
        (error) => {
          setError("ID Card upload failed (2 mb max)");
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({
              ...formData,
              userIdCard: downloadURL,
            });
            setUploading(false);
          });
        }
      );
    } catch (error) {
      setError("Error uploading ID card");
      setUploading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mt-20">
        Update a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 my-10"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <select
            id="propertyType"
            className="border p-3 rounded-lg"
            value={formData.propertyType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Property Type
            </option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            id="subType"
            className="border p-3 rounded-lg"
            value={formData.subType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Subtype
            </option>
            {formData.propertyType === "Residential"
              ? residentialSubtypes.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))
              : commercialSubtypes.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
          </select>

          {subSubTypeOptions[formData.subType] && (
            <select
              id="subSubType"
              className="border p-3 rounded-lg"
              value={formData.subSubType}
              onChange={handleChange}
              required={!!subSubTypeOptions[formData.subType]}
            >
              <option value="" disabled>
                Select {formData.subType} Subtype
              </option>
              {subSubTypeOptions[formData.subType].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Street"
            className="border p-3 rounded-lg"
            id="street"
            required
            onChange={handleChange}
            value={formData.street}
          />
          <input
            type="text"
            placeholder="Pincode"
            className="border p-3 rounded-lg"
            id="pincode"
            required
            onChange={handleChange}
            onBlur={fetchAddressDetails}
            value={formData.pincode}
          />
          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded-lg"
            id="city"
            required
            onChange={handleChange}
            value={formData.city}
          />
          <input
            type="text"
            placeholder="State"
            className="border p-3 rounded-lg"
            id="state"
            required
            onChange={handleChange}
            value={formData.state}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            {formData.propertyType === "Residential" && (
              <>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span>Parking Spot</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="balcony"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.balcony}
                  />
                  <span>Balcony</span>
                </div>
              </>
            )}

            {/* <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div> */}
          </div>

          <div className="flex gap-6 flex-wrap">
            {formData.propertyType === "Residential" && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bedrooms || ""}
                  />
                  <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bathrooms || ""}
                  />
                  <p>Baths</p>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="minPrice"
                min="10000"
                max="100000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.minPrice || ""}
              />
              <div className="flex flex-col items-center">
                <p>Min. Price</p>
                {/* <span className="text-xs">(₹ / month)</span> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="maxPrice"
                min="20000"
                max="100000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.maxPrice}
              />
              <div className="flex flex-col items-center">
                <p>Max. Price</p>
                {/* <span className="text-xs">(₹ / month)</span> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <p className="font-semibold mt-4">
            ID Card Verification:
            <span className="font-normal text-gray-600 ml-2">
              Upload your ID card for verification
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleIdCardUpload}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="userIdCard"
              accept="image/*"
            />
            {formData.userIdCard && (
              <span className="text-green-500 self-center">✓ Uploaded</span>
            )}
          </div>

          {formData.userIdCard && (
            <div className="flex justify-between p-3 border items-center">
              <img
                src={formData.userIdCard}
                alt="ID Card"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userIdCard: "" })}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          )}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
