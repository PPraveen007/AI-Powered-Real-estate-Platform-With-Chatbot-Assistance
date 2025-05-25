// import React from "react";

// export default function About() {
//   return (
//     <div className="py-20 px-4 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4 text-slate-800">
//         About Smart Estate
//       </h1>
//       <p className="mb-4 text-slate-700">
//         Smart Estate is a leading real estate agency that specializes in
//         helping clients buy, sell, and rent properties in the most desirable
//         neighborhoods. Our team of experienced agents is dedicated to providing
//         exceptional service and making the buying and selling process as smooth
//         as possible.
//       </p>
//       <p className="mb-4 text-slate-700">
//         Our mission is to help our clients achieve their real estate goals by
//         providing expert advice, personalized service, and a deep understanding
//         of the local market. Whether you are looking to buy, sell, or rent a
//         property, we are here to help you every step of the way.
//       </p>
//       <p className="mb-4 text-slate-700">
//         Our team of agents has a wealth of experience and knowledge in the real
//         estate industry, and we are committed to providing the highest level of
//         service to our clients. We believe that buying or selling a property
//         should be an exciting and rewarding experience, and we are dedicated to
//         making that a reality for each and every one of our clients.
//       </p>
//     </div>
//   );
// }


import React from "react";

export default function About() {
  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-10 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-slate-800">
          About <span className="text-blue-600">Smart Estate</span>
        </h1>

        <p className="mb-6 text-lg text-slate-700 leading-relaxed">
          <span className="font-semibold text-blue-700">Smart Estate</span> is a premier real estate agency committed to
          helping clients seamlessly buy, sell, and rent properties in the most
          desirable neighborhoods. Our dedicated team of seasoned professionals
          ensures a smooth, hassle-free experience with every transaction.
        </p>

        <p className="mb-6 text-lg text-slate-700 leading-relaxed">
          Our mission is to empower clients with personalized guidance, expert
          insights, and a deep understanding of the real estate market. Whether
          you're searching for your dream home, looking to make an investment, or
          selling your property, we’re here to guide you every step of the way.
        </p>

        <p className="text-lg text-slate-700 leading-relaxed">
          At Smart Estate, we turn your goals into reality with unmatched service
          and professionalism. Real estate is more than just a transaction—
          it’s a life-changing experience, and we’re honored to be part of yours.
        </p>
      </div>
    </div>
  );
}
