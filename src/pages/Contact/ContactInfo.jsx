import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-white font-family">
      <div className="max-w-5xl mx-auto text-center">

        {/* Section Headings */}
        <p className="inline-block px-7 py-2 rounded-full text-sm font-bold 
          shadow-md border border-blue-300 bg-blue-50 
          uppercase tracking-[0.25em] text-blue-900">
          Contact Details
        </p>

        <h2 className="text-2xl md:text-4xl font-extrabold mt-3 py-5 
          text-blue-950 drop-shadow-xs">
          Ways to Reach Us
        </h2>

        <p className="text-gray-700 mt-3 text-md font-medium max-w-xl mx-auto">
          Choose your preferred method of communication.
          We're always happy to help and answer your questions.
        </p>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

          {/* Email */}
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col items-center text-center hover:border-red-600">
            <div className="p-4 bg-red-50 rounded-full mb-3">
              <Mail className="w-7 h-7 text-red-600" />
            </div>
            <h4 className="font-semibold text-blue-950 text-lg">Email</h4>
            <p className="text-sm text-gray-600 mt-1">support@example.com</p>
          </div>

          {/* Phone */}
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col items-center text-center hover:border-blue-600">
            <div className="p-4 bg-blue-50 rounded-full mb-3">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-950 text-lg">Phone</h4>
            <p className="text-sm text-gray-600 mt-1">+91 90000 00000</p>
          </div>

          {/* Location */}
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col items-center text-center hover:border-red-600">
            <div className="p-4 bg-red-50 rounded-full mb-3">
              <MapPin className="w-7 h-7 text-red-600" />
            </div>
            <h4 className="font-semibold text-blue-950 text-lg">Location</h4>
            <p className="text-sm text-gray-600 mt-1">Chennai, Tamil Nadu</p>
          </div>

          {/* Business Hours */}
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col items-center text-center hover:border-blue-600">
            <div className="p-4 bg-blue-50 rounded-full mb-3">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-950 text-lg">
              Business Hours
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Mon–Sat: 9:00 AM – 8:00 PM
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
