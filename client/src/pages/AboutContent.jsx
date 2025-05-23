// src/pages/AboutContent.jsx
import React from "react";
import { FaBullseye, FaLightbulb, FaHandshake, FaUsers } from "react-icons/fa"; // Import some icons

export function AboutContent() {
  return (
    <div className="py-5 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            About <span className="text-blue-600">SmartEstate</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Your trusted partner in finding the perfect property.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-8 sm:px-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Our Story
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You already know about us — we’re students from IIIT Raichur, and
              SmartEstate was born from our shared vision to simplify and
              modernize the real estate experience. Tired of outdated processes
              and a lack of transparency, we set out to create a platform that
              puts technology and user needs at the center.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Powered by AI-driven tools and ML-integrated systems, SmartEstate
              doesn't just list properties — it helps you find the best options
              based on your unique requirements and location preferences.
              Whether you’re looking for a house, a rental room, a hotel, or
              even a commercial space, our platform offers intelligent
              suggestions and accurate predictions to support your decisions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe property transactions should be as easy as buying a
              pen. No more knocking on doors or relying on scattered sources —
              with SmartEstate, your ideal space is just a few clicks away.
              We’re here to make the real estate journey seamless, informed, and
              truly user-first.
            </p>
          </div>
          <div className="bg-gray-100 px-6 py-4 sm:px-10">
            <p className="text-sm text-gray-500 italic">
              "Empowering your property dreams with smart solutions."
            </p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center text-blue-600 text-3xl mb-4">
              <FaBullseye />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              Our Mission
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              To provide a seamless, transparent, and personalized real estate
              experience.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center text-green-600 text-3xl mb-4">
              <FaLightbulb />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              Innovation
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              Leveraging technology to offer cutting-edge tools and insights
              with latest AI and ML technology.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center text-yellow-600 text-3xl mb-4">
              <FaHandshake />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              Integrity
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              Guiding you with honesty, trust, and unwavering ethical standards.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center text-purple-600 text-3xl mb-4">
              <FaUsers />
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              Customer Focus
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              Your needs and aspirations are at the heart of everything we do.
            </p>
          </div>
        </div>

        {/* Our Team (Optional - you can expand on this) */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-8 sm:px-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Meet Our Team
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Behind SmartEstate is a passionate student-led team from IIIT
              Raichur, driven by a shared vision to revolutionize the real
              estate experience. We — two dedicated students — combine our
              knowledge of technology with an understanding of the real estate
              market to create a platform that makes buying, renting, or listing
              any type of property simpler, smarter, and more accessible for
              everyone.
            </p>
            {/* You could add individual team member profiles here in a grid or list */}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <p className="mt-4 text-lg text-gray-600 leading-relaxed mb-6">
            Ready to find your dream property?
          </p>
          <a
            href="/Search" // Replace with your actual listings page link
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Explore Listings
          </a>
        </div>
      </div>
    </div>
  );
}
