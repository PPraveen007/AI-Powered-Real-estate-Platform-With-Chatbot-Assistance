import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react"; // Added useEffect
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Signin = lazy(() => import("./pages/Signin")); // Assuming you have Signin.jsx
const Signup = lazy(() => import("./pages/Signup")); // Assuming you have Signup.jsx
// Remove About import if it's no longer used as a separate page
// const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const UpdateListing = lazy(() => import("./pages/UpdateListing"));
const Listing = lazy(() => import("./pages/Listing"));
const Search = lazy(() => import("./pages/Search"));
// Correctly import Footer from components directory
const Footer = lazy(() => import("./pages/Footer")); // Corrected path

// A slightly better fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
    {" "}
    {/* Adjust min-h as needed */}
    <p className="text-slate-700 font-semibold text-lg">Loading...</p>
    {/* You could add a spinner here */}
  </div>
);

export default function App() {
  useEffect(() => {
    let script = null; // Keep track of the script element

    const loadVoiceflow = () => {
      script = document.createElement("script");
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        if (window.voiceflow) {
          try {
            window.voiceflow.chat.load({
              verify: { projectID: "6814a72887a54c892142a84c" },
              url: "https://general-runtime.voiceflow.com",
              versionID: "production", 
              // launch: { event: { type: "launch", payload: { auth_token: token } } },
              assistant: {
                persistence: "localStorage",
              },
            });
            
          } catch (error) {
            console.error("Error initializing Voiceflow:", error);
          }
        } else {
          console.warn("window.voiceflow not found after script load.");
        }
      };

      script.onerror = (error) => {
        console.error("Error loading Voiceflow script:", error);
      };

      document.body.appendChild(script);
    };

    loadVoiceflow();

    // Cleanup function to remove the script when the component unmounts
    return () => {
    };
  }, []);
  return (
    <BrowserRouter>
      {/* Header is outside Suspense and Routes */}
      <Header />
      {/* Use Flexbox to ensure footer sticks to the bottom */}
      <div className="flex flex-col min-h-screen">
        {/* Main content area that grows */}
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/sign-up" element={<Signup />} />
              {/* The /about route is removed as requested */}
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/search" element={<Search />} />
              <Route path="/listing/:listingId" element={<Listing />} />

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route
                  path="/update-listing/:listingId"
                  element={<UpdateListing />}
                />
              </Route>

              {/* Optional: Add a 404 Not Found Route */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Suspense>
        </main>

        {/* Footer is outside Routes, inside flex container, and needs its own Suspense */}
        <Suspense
          fallback={<div>{/* Minimal footer loading indicator */}</div>}
        >
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
