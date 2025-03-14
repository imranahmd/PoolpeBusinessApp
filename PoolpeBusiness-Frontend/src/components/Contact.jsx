import React, { useState } from "react";
import Footer from "./Footer";
import contactusherodesktop from "../Images/ContactImg/Cover (1).svg";

import houseiconsdesk from "../Images/ImagesSvg/house-icon-4d02496d32116bd9086d45fac3dbb9c4.svg";
import PhoneIcon from "../Images/phoneicon.svg";

const ContactPage = () => {
  const [showMap, setShowMap] = useState(false);

  const handleShowMap = () => {
    const address = "1600 Amphitheatre Parkway, Mountain View, CA";
    const formattedAddress = address.replace(/\s/g, "+");
    window.open(
      `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formattedAddress}`,
      "_blank"
    );
  };

  return (
    <>
      <div>
        <img
       
          className="w-[25rem]  h-[20vh] lg:object-cover lg:w-[100%] lg:h-[90%] lg:mt-[-42px] mt-[-2rem]"
          src={contactusherodesktop}
          alt="contact us hero desktop"
          
        />
      </div>

      <div className="max-w-screen-xl mx-auto -mt-[4vh]  font-inter">
        {/* Hero Section */}

        {/* <div className="p-6 -ml-[0.3rem]  lg:-ml-[1.3rem] rounded-lg ">
          <div className="lg:absolute lg:w-[219vh] lg:ml-[-27vh] flex flex-col md:flex-row items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex-[0.3] bg-[#2058BB] flex items-center justify-center p-4 h-[135px]">
              <img
                src={houseiconsdesk}
                alt="House Icon"
                className="w-[16rem] h-16 lg:w-46 lg:h-16 "
              />
            </div>
            <div className="flex-1 w-[25rem] h-[135px]  lg:w-4 lg:h-13 bg-[#62A1F5] flex items-center justify-between lg:px-4 lg:py-4 px-2 py-2  flex-wrap">
              <div className="ml-0  ml-[5rem] md:ml-[12rem] text-center md:text-left">
                <p className="text-white text-[16px] sm:text-[1.6rem]  font-semibold  sm:text-[1.8rem]">
                  Are you a PoolPe merchant?
                </p>
                <p className="text-white text-[10px]  lg:text-[16px] sm:text-[1.2rem]  text-md mt-2  sm:text-[1.3rem]">
                  Get support for business-related payment issues here.
                </p>
              </div>

            </div>
          </div>
        </div> */}

        <br className="my-8" />

        {/* Address and Map Section */}
        <div className="flex flex-col sm:flex-row p-6 lg:mt-[6rem]">
          {/* Left Content */}
          <div className="w-full sm:w-1/2">
            <h1 className="  text-[16px] lg:text-2xl font-semibold text-left">
              Registered Address
            </h1>
            <p className="mt-4  text-[10px] lg:text-[25px] font-inter font-italic text-gray-700 text-left w-full sm:w-[337px]">
              620, Tower B, Bhutani Alphathum, Sector - 90, Noida 201305,
              <br />
              Email: operation@poolpe.in
              <br />
              Phone: +91 8810412891 
            </p>
            {/* <button
              onClick={handleShowMap}
              className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg sm:mr-[30rem]"
            >
              View Map
            </button> */}
          </div>

          {/* Right Content: Map */}
          <div className="w-full sm:w-1/2 flex justify-center items-center mt-4 sm:mt-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.806459694276!2d77.4083199!3d28.5128018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9fcbe0273a1%3A0xd8ed754838e2f8a4!2sBhutani%20Alphathum!5e0!3m2!1sen!2sin!4v1696165329143!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
