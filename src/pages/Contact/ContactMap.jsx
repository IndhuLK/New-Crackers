import React from 'react'

const ContactMap = () => {
  return (
    <section className="w-full py-10 px-6 md:px-12 bg-white font-family">

      {/* Top Heading Center */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="inline-block px-7 py-2 rounded-full text-sm font-bold 
          shadow-md border border-red-300 bg-red-50 
          uppercase tracking-[0.25em] text-red-600">
          Find Us
        </p>

        <h2 className="text-2xl md:text-4xl font-extrabold mt-3 py-5 
          text-blue-950 drop-shadow-xs">
          Visit Our Location
        </h2>

        <p className="text-gray-700 mt-3 text-md font-medium max-w-3xl mx-auto">
          Come visit us in Sivakasi, Tamil Nadu — The Fireworks Capital of India.
        </p>
      </div>

      {/* Google Map Embed */}
      <div className="w-full flex justify-center">
        <div className="w-[800px] h-[150px] md:h-[250px] rounded-2xl 
  overflow-hidden shadow-lg text-center border border-gray-200">

          <iframe
            title="Sivakasi Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251595.23893910547!2d77.674938!3d9.454356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf8c9179d3df%3A0xe5b5496ad3e5317c!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full border-0"
          ></iframe>

        </div>
      </div>


    </section>
  );
};

export default ContactMap;
