import React, { useEffect, useState } from "react";
import DownloadButton from "../components/DownloadButton";
import HomeScreenMock from "../components/HomeScreenMock";
import Footer from "./Footer";

import { useInView } from "react-intersection-observer"; // Import the hook

import servicepng1 from "../Images/hemant.jpg";
import servicepng2 from "../Images/muskan.jpg";
import servicepng3 from "../Images/anshita.jpg";

import servicepng4 from "../Images/Homeimg/a-photo-of-an-indian-merchant-man-with-a_2yXHIYeYQceg0bAWo_q9xw_Jwp6wk7sRTKrYJ-csgvaew.jpeg";
import servicepng5 from "../Images/Homeimg/a-photo-of-an-indian-merchant-man-with-a_YcOpbIgYSWKy3yIEVoYWBg_Jwp6wk7sRTKrYJ-csgvaew.jpeg";
import servicepng6 from "../Images/Homeimg/a-photo-of-an-indian-merchant-man-with-a_vdlTovyiT6W91Hrj5q1Q9A_Jwp6wk7sRTKrYJ-csgvaew.jpeg";
import appleicon from "../Images/ImagesSvg/image 2.svg";

import Frame930 from "../Images/Homeimg/Mob-left 3.svg";
import Frame931 from "../Images/Homeimg/Mobanim-left 1.svg";
import Frame932 from "../Images/Homeimg/Mobanim-left 2.svg";
import Frame933 from "../Images/Homeimg/Frame 931.svg";
import Frame934 from "../Images/Homeimg/Frame 930.svg";
import Frame935 from "../Images/Homeimg/Frame 930.svg";
import ZoomImage from "../utils/ZoomImage";

export default function Home2() {
  const { ref: slideUpRef, inView: isSlideUpVisible } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });
  const { ref: slideUpRef2, inView: isSlideUpVisible2 } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });
  const imageArray = [
    Frame930,
    Frame931,
    Frame932,
    Frame933,
    Frame934,
    Frame935,
  ];
  const [currentFlippedIndex, setCurrentFlippedIndex] = useState(0);

  const teamMembers = [
    {
      name: "Hemant Kumar",
      designation:
        "The combination of QR code payments and real-time transaction monitoring is unbeatable. I get instant notifications for every transaction, on receiving money. The detailed transaction history with timestamps is a lifesaver when reconciling my accounts. The transparency is impressive. Amazing features !",
      img: servicepng1,
    },
    {
      name: "Muskan Jain",
      designation:
        "This app makes QR code generation a breeze! Whether I’m sharing my QR code for payments or creating one for my small business, it’s super quick and effortless.The live transaction tracking feature is fantastic! I love how I can monitor payments in real time and instantly know if a transaction is successful. It makes me feel in control of my finances.",
      img: servicepng2,
    },
    {
      name: "Anshit Khullar",
      designation:
        "As a small business owner, I rely heavily on this app. QR code payments and real-time transaction updates make it so easy to manage daily sales. Best of all, the settlement to my bank account is visible real time!",
      img: servicepng3,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlippedIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 400);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div
        className=" min-h-screen p-5 w-fill font-inter"
        style={{ marginLeft: "-10vh" }}
      >
        {/* Transforming  */}
        <div className="container w-full lg:w-full ">
          <div className="flex flex-wrap items-center justify-between">
            {/* Left Section */}
            <div className="w-full lg:max-w-[50%] p-4 ml-[5rem]">
              <p className="text-[#000F3B] text-[24px] lg:text-[32px] text-left leading-[32px] lg:leading-[45px] font-inter mb-[20px] lg:mb-[35px]">
                Introducing{" "}
                <span className="text-[#397BFF] font-bold relative w-[17rem] font-inter inline-block before:absolute before:inset-1 before:animate-typewriter before:bg-white">
                  PoolPe Business
                </span>
              </p>
              <p className="text-[#1E1E1E] font-figtree text-[28px] lg:text-[46px] font-bold leading-[40px] lg:leading-[64px] mb-4 text-left">
                Transforming Payments <br /> for{" "}
                <span className="text-[#2058BB]">Merchants</span>
                <br /> everywhere
              </p>

              <p className="text-[#666] font-figtree text-[16px] lg:text-[24px] font-semibold leading-[24px] lg:leading-[36px] tracking-[-0.48px] text-left">
                PoolPe Business - Discover our innovative payment app for a
                seamless and secure way to accept payments from your customers.
              </p>
              {/* my-6 */}
              <div className="w-full lg:w-[50%] mt-[28rem] my-[0.5rem] lg:my-8 lg:ml-[4rem]">
                {/* <DownloadButton /> */}
                <div className="flex flex-col sm:flex-row gap-6 items-center ml-[-5rem] ">
                  {/* Google Play Button */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.poolpebusiness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex  items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg p-2 shadow-md transition-all"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play Icon"
                      className="w-20 lg:w-40 h-auto"
                    />
                  </a>

                  {/* Apple Store Button */}
                  <a
                    href="https://apps.apple.com/in/app/poolpe-business/id6738406440"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg p-2 shadow-md transition-all"
                  >
                    <img
                      src={appleicon}
                      alt="Apple Store Icon"
                      className="w-20 lg:w-40 h-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="w-full h-0 pb-[112%] lg:pb-[45%] lg:mt-[-37rem] mt-[-45rem] ml-[-5rem] rounded-[15px] relative z-10 sm:mt-[110%]">
                {/* Frame 930 */}
                {imageArray.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Frame ${index}`}
                    className={`absolute lg:w-full lg:h-full w-full h-[29rem] rounded-md transition-transform duration-1000 ease-in-out 
          ${
            currentFlippedIndex === index
              ? "opacity-100 rotate-y-0"
              : "opacity-0 rotate-y-180"
          }
          sm:ml-[10%] ml-[11vh] md:ml-[22rem]`} // Adjusted margin-left for responsiveness
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="h-auto lg:h-[600px] flex justify-center items-center w-full mt-[1vh] mx-auto ">
          <div className="flex flex-col lg:flex-row justify-end items-center max-w-[1260px] ml-[5rem] w-full">
            <div ref={slideUpRef} className="mt-[6vh] w-full px-4 lg:px-0">
              {/* <p
                className={` text-[#1E1E1E] font-figtree text-center text-[32px] lg:text-[56px] font-bold leading-[40px] lg:leading-[64px] mb-4 tracking-[-0.5px] lg:tracking-[-0.72px] ${
                  isSlideUpVisible ? "motion-safe:animate-slide-up" : ""
                }`}
              >
                PoolPe Business is for{" "}
                <span className="text-[#2058BB]">Everyone</span>
              </p> */}
              <p
                className={`text-[#1E1E1E] font-inter text-center text-[16px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[12px] font-bold leading-[40px] sm:leading-[48px] md:leading-[56px] lg:leading-[64px] mb-4 tracking-[-0.5px] lg:tracking-[-0.72px] ${
                  isSlideUpVisible ? "motion-safe:animate-slide-up" : ""
                }`}
              >
                PoolPe Business is for{" "}
                <span className="text-[#2058BB]">Everyone</span>
              </p>

              <div className="flex flex-col lg:flex-row items-center w-full gap-6">
                {/* Left Section */}
                <div className="w-full lg:w-1/2 flex-shrink-0">
                  <HomeScreenMock />
                </div>

                {/* Right Section */}
                {/* sm:border-black */}
                <div className="font-inter w-full lg:w-1/2    w-[9rem] p-4 flex-shrink-0">
                  <div>
                    <p className="text-left text-[12px]  lg:text-[18px] py-4">
                      <span className="text-left lg:text-[25px] text-[15px] text-black font-figtree   font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        🛠️ Manage Business Details:
                      </span>{" "}
                      <br />
                      <br />
                      Update account and business details easily with a
                      user-friendly interface.
                    </p>
                    <hr />

                    <p className="mb-4 text-[12px]  lg:text-[18px] text-left py-4">
                      <span className="text-left lg:text-[25px] text-[15px]  text-black font-inter  font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        📊 Track Your Earnings:
                      </span>{" "}
                      <br />
                      <br />
                      Monitor transactions and settlements in real-time for
                      better financial control.
                    </p>
                    <hr />
                    <p className="mb-4 text-left text-[12px]  lg:text-[18px] py-4">
                      <span className="text-left  lg:text-[25px] text-[15px]    font-figtree font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        🔒 Secure and Trusted:
                      </span>{" "}
                      <br />
                      <br />
                      Industry-standard encryption to keep your business data
                      safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature */}
        <div className="  w-full px-4 ">
          <div className="bg-white rounded-lg p-6 lg:p-10 max-w-[1200px]  ml-[5rem] mx-auto">
            {/* Header */}
            <div ref={slideUpRef2} className="text-center mb-6">
              <p
                className={`text-2xl lg:text-3xl font-bold leading-none tracking-[-0.72px] ${
                  isSlideUpVisible2 ? "motion-safe:animate-slide-up" : ""
                }`}
              ></p>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between space-y-6 lg:space-y-0 lg:space-x-6 text-left mb-6">
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:mt[-3h] lg:ml-[5.2vh] -mt-[19vh] ">
                <div className="text-center px-3 py-3 lg:mt[-4h] mt-[11vh] absolute lg:relative">
                  <div className=" absolute  w-[5rem]  lg:w-[9rem] mt-[21rem] lg:mt-[5rem] ml-[-1.2rem] lg:ml-[-1.7rem] lg:mt-2 ml-[5rem]">
                    <ZoomImage />
                  </div>
                  <div>
                    <img
                      src={servicepng4}
                      alt="Feature 1"
                      className="w-[10rem] lg:w-[265px]     max-w-[280px] h-[250px]  lg:mt-[8rem] mt-[23em]   sm:max-w-[250px] md:max-w-[300px] lg:max-w-[380px]   h-auto rounded-full"
                    />
                    <p className="text-black font-bold mt-2 text-[10px] lg:text-[1rem]">
                      Smile with every Transaction
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <p className="text-[#2058BB]  font-inter text-[21px] mt-[3rem] lg:text-[1.6rem]   font-bold leading-none mb-4 ml-[5rem]">
                  Integrated Payment Gateway
                </p>
                <p className="leading-normal text-[10px] lg:text-[30px]  text-gray-700 text-base py-6 font-inter ml-[5rem]">
                  Accept all payment modes through one unified platform. Say
                  goodbye to payment hassles. Seamlessly manage transactions,
                  boost efficiency, and simplify your business with a single
                  payment solution.
                </p>
              </div>
            </div>

            {/* Feature 2: Text Left, Image Right */}
            <div className=" flex flex-col lg:flex-row items-center lg:items-start justify-between space-y-6 lg:space-y-0 lg:space-x-6 text-left mb-6">
              <div className="w-full lg:w-1/2">
                <p className="text-[#2058BB] font-inter text-lg text-[10px] lg:text-[1.6rem] font-bold leading-none mb-4 lg:mt-0  mt-[29vh] ml-[5rem]">
                  Transparent Payment
                </p>
                <p className="leading-normal text-[10px] lg:text-[30px]  text-gray-700 text-base py-6   font-inter lg:mt-4 lg:mt-4 mt-[-1vh] mb-4 overflow-hidden ml-[5rem]">
                  Gain valuable insights into sales performance, customer
                  behavior, and revenue trends. Leverage data-driven decisions,
                  identify top-selling products, understand customer
                  preferences, optimize inventory management, and personalize
                  marketing strategies.
                </p>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="text-center  px-3 py-3">
                  <div className="absolute w-[5rem] lg:w-[9rem] mt-[-2rem] lg:mt-[-4rem] lg:ml-[-3.9rem] ml-[-1.7rem] lg:mt-2 ">
                    <ZoomImage />
                  </div>
                  <div>
                    <img
                      src={servicepng5}
                      alt="Feature 2"
                      className="w-[10rem] lg:w-[16rem] max-w-[240px] h-[150px]  lg:h-[250px]  object-cover rounded-full"
                    />
                    <p className="text-black font-bold text-[10px] lg:text-[1rem] mt-2">
                      For Every Age & Every Business
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Image Left, Text Right */}
            <div className="flex flex-col lg:flex-row items-center  lg:items-start justify-between space-y-6 lg:space-y-0 lg:space-x-6 text-left ml-[5rem]">
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className="text-center lg:relative absolute lg:mt-[3vh] mt-[45vh]   px-3 py-3">
                  <div className=" absolute w-[5rem] lg:w-[9rem]  mt-[-1rem] lg:mt-[-2rem] lg:ml-[-1.2rem] ml-[-1.3rem] lg:mt-2">
                    <ZoomImage />
                  </div>
                  {/* w-[5rem]  lg:w-[9rem] mt-[21rem] lg:mt-[5rem] ml-[7rem] lg:ml-[6rem] lg:mt-2 */}
                  <div>
                    <img
                      src={servicepng6}
                      alt="Feature 3"
                      // lg:ml-[3rem] ml-[8rem]
                      className="w-[10rem] lg:w-[333px]  max-w-[280px] h-[150px] lg:h-[250px] rounded-full text-[10px] lg:text-[1.6rem]"
                    />
                    <p className="text-black text-[10px] lg:text-[1rem] font-bold mt-2">
                      Empowering Small Businesses
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <p className="text-[#2058BB] font-figtree text-[16px] lg:text-[1.6rem] font-bold leading-none mb-4 ">
                  Quick Settlement
                </p>
                <p className="leading-normal text-[10px] lg:text-[30px] text-gray-700 text-base py-6   font-inter text-[35px] mt-4 mb-4 overflow-hidden ">
                  Effortlessly review your past sales history to track
                  performance and make informed decisions. Access detailed
                  transaction records, identify sales patterns, monitor growth,
                  and recognize seasonal trends
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white w-full px-2 py-4">
          <div className=" flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6 ">
            <p className=" ml-[0.5rem] text-xs md:text-xs text-black lg:mt-0 mt-[29vh] text-right lg:text-[1.6rem] lg:text-left font-inter  font-bold leading-[1.5]">
              Transform your Payment Journey with{" "}
              <span className="text-[#2058BB] text-xs md:text-xs lg:text-[1.6rem] ">
                Poolpe Business
              </span>
            </p>
          </div>
        </div>

        {/* more stories   */}
        <div className="bg-blue p-8 border-0 lg:border-3 ml-[5rem]">
          <p className="font-bold text-[20px] lg:text-[2.25rem]   text-[#212529]">
            PoolPe Merchant Stories
          </p>
          <div className="flex flex-wrap justify-center gap-8 p-6 bg-gray-100">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white text-[10px] lg:text-[1.6rem] rounded-lg shadow-md text-center p-6 max-w-xs hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-14 h-14 lg:w-64 lg:h-64 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl text-[10px] lg:text-[1.6rem] font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.designation}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="w-[110%] ml-[5vh] lg:w-[110%]  max-w-full ">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
