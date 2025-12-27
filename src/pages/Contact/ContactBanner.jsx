import { Phone, Mail, MessageSquare } from "lucide-react";
import bgImg from "../../assets/contactbanner.jpg"; // your image file

const ContactBanner = () => {
  return (
    <div className="relative w-full py-20 px-6 md:px-12 
    overflow-hidden font-family h-[500px]">

      {/* Background Image */}
      <img
        src={bgImg}
        alt="Contact Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative text-center max-w-2xl mx-auto text-blue-950 z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide text-blue-950 drop-shadow-sm">
          WE'RE HERE TO HELP
        </h2>

        <h3 className="text-xl font-semibold mb-2 text-red-600 drop-shadow-sm">Get in Touch</h3>

        <p className="text-base md:text-lg opacity-90 leading-relaxed font-medium text-blue-950">
          Have questions? We'd love to hear from you.
          Send us a message and we'll respond as soon as possible.
        </p>

        {/* Contact Icons */}
        <div className="flex items-center justify-center gap-8 mt-10">

          {/* Call */}
          <div
            className="p-4 bg-white rounded-full shadow-xl cursor-pointer 
            hover:scale-110 transition duration-300 text-blue-900 border border-blue-100"
          >
            <Phone size={30} />
          </div>

          {/* Email */}
          <div
            className="p-4 bg-white rounded-full shadow-xl cursor-pointer 
            hover:scale-110 transition duration-300 text-red-600 border border-red-100"
          >
            <Mail size={30} />
          </div>

          {/* WhatsApp */}
          <div
            className="p-4 bg-white rounded-full shadow-xl cursor-pointer 
            hover:scale-110 transition duration-300 text-blue-600 border border-blue-100"
          >
            <MessageSquare size={30} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
