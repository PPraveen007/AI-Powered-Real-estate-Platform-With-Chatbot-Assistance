import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import ReCAPTCHA from "react-google-recaptcha";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [captchaToken, setCaptchaToken] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      dispatch(signInFailure("Please verify that you're not a robot"));
      return;
    }

    try {
      dispatch(signInStart());
      const dataToSubmit = { ...formData, captchaToken };

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Sign In to <span className="text-blue-600">SmartEstate</span>
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your password"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
            {error === "Please verify that you're not a robot" && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline w-full"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <OAuth className="w-full py-3 px-6 rounded-md focus:outline-none focus:shadow-outline" />{" "}
        </form>
        {/* <OAuth /> */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-600 text-sm">Don't have an account?</p>
          <Link
            to={"/sign-up"}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Sign Up
          </Link>
        </div>
        {error && error !== "Please verify that you're not a robot" && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
