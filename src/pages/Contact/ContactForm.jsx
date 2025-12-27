import React from "react";
import contactSide from "../../assets/contact-side.jpg"; // your image

const ContactForm = () => {
  return (
    <section className="w-full py-10 px-6 md:px-12  font-family
      bg-white
       shadow-xl border border-red-200">

      {/* ---------------- TOP CENTER HEADING ---------------- */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="inline-block px-7 py-2 rounded-full text-sm font-bold 
          shadow-md border border-blue-200 bg-blue-50 
          uppercase tracking-[0.25em] text-blue-900">
          Send Message
        </p>

        <h2 className="text-2xl md:text-4xl font-extrabold mt-3 py-5 
          text-blue-950 drop-shadow-xs">
          Let's Start a Conversation
        </h2>

        <p className="text-gray-700 mt-3 text-md font-medium max-w-3xl mx-auto">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* ---------------- MAIN GRID ---------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* ---------------- LEFT SIDE – IMAGE + WHY CHOOSE US ---------------- */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">

          {/* Background Image */}
          <img
            src={contactSide}
            alt="Why Choose Us"
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-blue-950/70"></div>

          {/* Text Content Over Image */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>

            <ul className="space-y-3 text-base">
              <li className="flex items-center gap-2">
                <span className="text-red-500 text-lg">✔</span>
                Quick Response Time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500 text-lg">✔</span>
                Expert Guidance
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500 text-lg">✔</span>
                100% Customer Satisfaction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500 text-lg">✔</span>
                Secure & Confidential
              </li>
            </ul>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE – CONTACT FORM ---------------- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">

          <form className="grid grid-cols-1 gap-5">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-blue-950">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-red-600 focus:outline-none text-black"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-blue-950">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-red-600 focus:outline-none text-black"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-blue-950">Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-red-600 focus:outline-none text-black"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-blue-950">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-red-600 focus:outline-none text-black"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg 
      font-semibold text-lg hover:bg-red-700 transition-all shadow-md "
            >
              Send Message
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};

export default ContactForm;
