import { useState } from "react";

export default function ContactForm({ listing, onClose }) {
  const [isBroker, setIsBroker] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendMessage = () => {
    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!phoneNumber) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!termsAgreed) {
      setErrorMessage("Please agree to the terms.");
      return;
    }

    // Construct the email link
    const mailtoLink = `mailto:${
      listing.landlordEmail
    }?subject=Enquiry regarding ${listing.name}&body=Regarding the listing: ${
      listing.name
    }\n\n${
      isBroker ? "I am a broker." : "I am an individual."
    }\nName: ${name}\nPhone Number: +91${phoneNumber}\n\nMessage:\n${message}`;

    // Open the email client
    window.location.href = mailtoLink;

    // Optionally, you can close the modal after sending
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      {" "}
      {/* Added z-50 here */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md z-50 relative">
        {" "}
        {/* Added z-50 and relative here */}
        <h2 className="text-xl font-semibold mb-4">Contact Landlord</h2>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        <div className="mb-3">
          <label
            htmlFor="userType"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            You are a:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="individual"
              name="userType"
              value="individual"
              checked={!isBroker}
              onChange={() => setIsBroker(false)}
            />
            <label htmlFor="individual" className="text-gray-700 text-sm">
              Individual
            </label>
            <input
              type="radio"
              id="broker"
              name="userType"
              value="broker"
              checked={isBroker}
              onChange={() => setIsBroker(true)}
            />
            <label htmlFor="broker" className="text-gray-700 text-sm">
              Broker
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number (+91):
          </label>
          <input
            type="tel"
            id="phoneNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Message:
          </label>
          <textarea
            id="message"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
          ></textarea>
        </div>
        <div className="mb-3 flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="mr-2 leading-tight"
            checked={termsAgreed}
            onChange={() => setTermsAgreed(!termsAgreed)}
          />
          <label htmlFor="terms" className="text-gray-700 text-sm">
            I agree to the terms and conditions.
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
