import React from "react";
import payfiwhiteimg from "../Images/payfiwhiteimg.png";
import footerlogo1 from "../Images/Footerimg/PayniteWhiteLogo.png";
import footerlogo2 from "../Images/Footerimg/PayniteWord.png";
import email from "../Images/email-1-svgrepo-com.svg";

const Footer = () => {
  const pdfUrl = "../Images/Footerimg/PayNite.pdf"; // Provide the path to your PDF file
  const pageNumber = 1; // Choose the page number you want to display

  return (
    <div className="w-full lg:w-[120rem]">
      <footer className="text-white mt-4 shadow-lg w-full bg-[#2058BB] border border-gray-500 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex  flex-wrap items-center justify-between">
            {/* Logo Section */}
            <div className="w-full lg:w-auto text-center lg:text-left lg:ml-[-12rem] sm:text-left mb-3 sm:mb-0 flex flex-col lg:flex-row items-center justify-center">
              <div className="mb-4 lg:mb-0">
                <img
                  src={footerlogo1}
                  alt="Payfi Logo"
                  className="w-[3rem] lg:w-[5rem] mt-[2rem] max-w-[150px] sm:max-w-[210px] mx-auto sm:mx-0"
                />
              </div>
              <div className="lg:ml-4 mt-[-2rem]">
                <img
                  src={footerlogo2}
                  alt="Payfi Logo"
                  className="w-[7rem] lg:w-[9rem] mt-[2rem] max-w-[150px] sm:max-w-[210px] mx-auto sm:mx-0"
                />
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="w-full sm:w-auto flex flex-col space-y-4 text-center sm:text-left">
              {/* Address */}
              <div className="flex ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-11 h-6 text-white mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a3 3 0 013 3c0 2.25-3 5.25-3 5.25s-3-3-3-5.25a3 3 0 013-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.75a6 6 0 00-6 6c0 3.75 6 10.5 6 10.5s6-6.75 6-10.5a6 6 0 00-6-6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  />
                </svg>
                <span className="text-left lg:mr-[6.7rem]">
                  620, Tower B, Bhutani Alphathum, Sector-90, Noida
                </span>
              </div>

              {/* Email */}
              <div className="flex">
                <img src={email} alt="Email Icon" className="w-9 h-6 mr-2" />
                <span className="text-left lg:ml-[0.7rem] ">
                  operations@poolpe.in
                </span>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-6 text-center text-xs sm:text-[3vh] lg:ml-[-28rem]">
            <p>
              © {new Date().getFullYear()} PayNite technologies All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
