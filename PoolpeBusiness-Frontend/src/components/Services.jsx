import React, { useState } from "react";
import Footer from "./Footer";

import servicepng1 from "../Images/hemant.jpg";
import servicepng2 from "../Images/muskan.jpg";
import servicepng3 from "../Images/anshita.jpg";


import amino4 from "../Images/ServiceImg/amico4.svg";
import amino3 from "../Images/ServiceImg/amico.svg";
import Device from "../Images/ServiceImg/Device.svg";
import cuate from "../Images/ServiceImg/cuate.svg";

import appleicon from "../Images/ImagesSvg/image 2.svg";

import rtm from "../Images/rtm3.png";

import v1 from "../Images/videos/Recording 2025-01-28 120330 (1).mp4";

function Service() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const teamMembers = [
    {
      name: "John Doe",
      designation: "Software Engineer",
      img: servicepng1,
    },
    {
      name: "Jane Smith",
      designation: "Project Manager",
      img: servicepng2,
    },
    {
      name: "Alice Johnson",
      designation: "UI/UX Designer",
      img: servicepng3,
    },
  ];

  return (
    <>
      <div className="  App font-inter">
        <h1 className="ml-3  py-3 text-[15px]  lg:text-[38px] font-inter relative overflow-hidden before:absolute before:inset-1 before:animate-typewriter text-[#2058BB] before:bg-white">
          Real-time Monitoring of Financial Transactions
        </h1>
        <div className="flex">
          {/* Button Container */}
          <div className="flex flex-col sm:flex-row gap-6 items-center mt-[12rem] lg:ml-[18rem] ml-[7rem] lg:-mt-[22rem] ">
            {/* Google Play Button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.poolpebusiness"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg   transition-all w-[10rem] sm:w-[12rem]"
              >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play Icon"
                className="w-[100px] lg:w-40 h-auto"
              />
            </a>

            {/* Apple Store Button */}
            <a
              href="https://apps.apple.com/in/app/poolpe-business/id6738406440"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3   lg:ml-0  rounded-lg   transition-all w-[10rem] sm:w-[12rem]"
            >
              <img
                src={appleicon}
                alt="Apple Store Icon"
                className="w-[100px] lg:w-40  h-auto"
              />
            </a>
          </div>
          {/* Image Loader */}
          <div className="relative w-full max-w-4xl h-[28rem]   lg:h-[55rem]  md:h-[40rem] lg:h-[50rem] mx-auto mt-1 lg:ml-0 ml-[-23vh] sm:mt-8">
            {!isImageLoaded && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                <p className="ml-3 text-gray-500">Loading image...</p>
              </div>
            )}
              <img
                src={rtm}
                alt="Remote Monitoring"
                className={` w-[100vh] lg:w-full  h-auto   lg:max-w-[90%] max-w-[15rem]  sm:max-w-[20rem] lg:max-w-[97%]  object-contain transition-opacity duration-500 
                            ml-[-212px]  lg:ml-[-6rem] 
                            mt-[1.5rem] sm:mt-8 lg:mt-10 
                            max-h-[15rem] sm:max-h-[25rem] md:max-h-[35rem] lg:max-h-[40rem]  h-[23vh]
                            
                            ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setIsImageLoaded(true)}
                            onError={() => console.error("Image failed to load.")}
                  />
              </div>


            </div>

        {/* Render the rest of the component only after the image is loaded */}
        {isImageLoaded && (
          <>
            <div className="flex flex-col items-center justify-center -mt-[11rem]"></div>



            {/* <hr /> */}
            <div className="p-8 ">
              <div className="p-8  mt-2 lg:mt-[12rem] ">
                <h1 className="font-inter ml-[-2rem] text-base lg:mt-[-14vh] text-[13px] lg:text-[43px]  leading-6 ">
                  Secure Payments! .......Anytime! Anywhere!
                </h1>
              </div>

              <br />
              <div className="flex flex-wrap justify-center gap-6">
                <div className="shadow-lg border border-1 py-3 rounded max-w-[20rem]">
                  <img
                    className="px-3 mx-auto w-[16rem]"
                    src={cuate}
                    alt="Integrated Payment Gateway"
                  />
                  <h3 className="text-center text-lg font-semibold mt-3">
                    Payment made easy
                  </h3>
                  <p className="font-inter text-[12px]  lg:text-[18px] text-center px-3 mt-2">
                    Simplify your payments & enjoy smooth transactions with
                    BharatPe UPI Scan and Pay. Also pay utility and credit card
                    bills, get gift vouchers, avail loans, and more.
                  </p>
              
                </div>
                <div className="shadow-lg border border-1 py-3 rounded max-w-[20rem]">
                  <img
                    className="px-3 mx-auto w-[16rem]"
                    src={amino3}
                    alt="Integrated Payment Gateway"
                  />
                  <h3 className="text-center text-lg font-semibold mt-3">
                    Integrated Payment Gateway
                  </h3>
                  <p className="font-inter text-[12px]  lg:text-[18px] text-center px-3 mt-2">
                    Accept all payment modes through one unified platform. Say
                    goodbye to payment hassles. Seamlessly manage transactions,
                    boost efficiency, and simplify your business with a single
                    payment solution.
                  </p>
                </div>


                <div className="shadow-lg border border-1 py-3 rounded max-w-[20rem]">
                  <img
                    className="px-3 mx-auto w-[16rem]"
                    src={amino4}
                    alt="Sales Analytics & Reporting"
                  />
                  <h3 className="text-center text-lg font-semibold mt-3">
                    Sales Analytics & Reporting
                  </h3>
                  <p className="font-inter text-[12px]  lg:text-[18px] text-center px-3 mt-2">
                    Gain valuable insights into sales performance, customer
                    behavior, and revenue trends. Leverage data-driven
                    decisions, identify top-selling products, understand
                    customer preferences, optimize inventory management, and
                    personalize marketing strategies.
                  </p>
              
                </div>
                <div className="shadow-lg border border-1 py-3 rounded max-w-[20rem]">
                  <img
                    className="px-3 mx-auto w-[16rem]"
                    src={Device}
                    alt="Sales History"
                  />
                  <h3 className="text-center text-lg font-semibold mt-3">
                    Access to your Sales History Easily
                  </h3>
                  <p className="font-inter text-[12px]  lg:text-[18px] text-center px-3 mt-2">
                    Effortlessly review your past sales history to track
                    performance and make informed decisions. Access detailed
                    transaction records, identify sales patterns, monitor
                    growth, and recognize seasonal trends.
                  </p>
                </div>
              </div>
            </div>

            {/* c:\Users\acer\Downloads\Recording 2025-01-28 120330 (1).mp4 */}

            <div className="flex flex-col md:flex-row items-center justify-center mt-8 space-y-8 md:space-y-0 md:space-x-8 px-4">
  {/* Text Section */}
  <div className="w-full md:w-1/2 text-left md:text-left">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Power Up Your Business with <span className="text-[#F26727]">Bharat Connect!</span>
      </h1>
    </div>
    <div className="mt-4">
      <p className="text-base md:text-lg text-[1.5rem] font-inter leading-relaxed">
        From mobile recharges to bill payments and utility services,
         Bharat Connect on PoolPe Business gives you the tools to do more
          for your customers and your business. It’s fast, reliable, and designed to keep you ahead.
      </p>
    </div>
    <div className="mt-4">
      {/* <p className="text-lg font-semibold text-[#F26727]">What you can offer:</p> */}
      <ul className="list-disc list-inside mt-2 font-inter">
        <li className="text-[#37474F] lg:text-[1.5rem] font-inter"><span className="text-[#37474F] lg:text-[1.5rem] font-inter ">Mobile & DTH Recharges –</span>  Quick and seamless top-ups.</li>
        <li className="text-[#37474F] lg:text-[1.5rem] font-inter"><span className="text-[#37474F] lg:text-[1.5rem] font-inter">Bill Payments –</span> Electricity, water, gas, and more.</li>
        <li className="text-[#37474F] lg:text-[1.5rem] font-inter"><span className="text-[#37474F] lg:text-[1.4rem] font-inter">Loan & EMI Payments – </span> Easy repayment options for customers.</li>
        <li className="text-[#37474F] lg:text-[1.5rem] font-inter"><span className="text-[#37474F] lg:text-[1.5rem] font-inter">FASTag Recharge – </span>Keep vehicles moving without hassle.</li>
        <li className="text-[#37474F] lg:text-[1.5rem] font-inter"><span className="text-[#37474F] lg:text-[1.5rem] lg:font-inter">Insurance Services – </span> Help customers with premium payments.</li>
        
      </ul>
    </div>
    {/* <p className="text-sm md:text-base text-gray-700 mt-6">
      A super simple, easy-to-use platform for paying daily utility bills! 
      Electricity, water, gas, broadband, and even DTH—can be paid in one place. 
      Reliable and convenient tool to track due dates and pay on time.
    </p> */}
  </div>

  {/* Video Section */}
  <div className="border border-0  w-full md:w-1/2 flex justify-center">
    <video className="max-w-full outline-none border-none  m-0 p-0" src={v1} alt="BBPS"   controls loop  />
  </div>
</div>



            <div className="w-[95%] ml-[1vh] lg:w-[110%]">
              <Footer />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Service;
