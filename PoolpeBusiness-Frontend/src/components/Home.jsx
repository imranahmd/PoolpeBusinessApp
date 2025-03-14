import React, { useEffect, useState } from "react";
import DownloadButton from "../components/DownloadButton";
import HomeScreenMock from "../components/HomeScreenMock";
import Footer from "./Footer";

import { useInView } from "react-intersection-observer"; // Import the hook

import Frame930 from "../Images/Homeimg/Frame 930.svg";
import Frame931 from "../Images/Homeimg/Frame 931.svg";
import Frame932 from "../Images/Homeimg/Frame 930.svg";
import Frame933 from "../Images/Homeimg/Frame 931.svg";
import Frame934 from "../Images/Homeimg/Frame 930.svg";
import Frame935 from "../Images/Homeimg/Frame 930.svg";

import servicepng1 from "../Images/servicepng1.png";
import servicepng2 from "../Images/servicepng2.png";
import servicepng3 from "../Images/servicepng3.png";



export default function Home2() {
  const { ref: slideUpRef, inView: isSlideUpVisible } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });
  const { ref: slideUpRef2, inView: isSlideUpVisible2 } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });
  const imageArray = [Frame930, Frame931, Frame932, Frame933, Frame934, Frame935];
  const [currentFlippedIndex, setCurrentFlippedIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlippedIndex((prevIndex) => (prevIndex + 1) % 2);
    },400);
  
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div
        className=" min-h-screen p-5 w-fill font-inter"
        style={{ marginLeft: "-10vh" }}
      >
        {/* Transforming  */}
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between">
            {/* Left Section */}
            <div className="max-w-[50%] p-4 ">
            <p className="text-[#000F3B] text-[32px] text-left leading-[45px] font-inter mb-[35px]">
              Introducing{" "}
              <span className="text-[#397BFF] font-bold relative w-[17rem] font-inter inline-block before:absolute before:inset-1   before:animate-typewriter before:bg-white">
                PoolPe Business
              </span>
              
            </p>
              <p className="text-[#1E1E1E] font-figtree text-[46px] font-bold leading-[64px] mb-4 text-left">
                Transforming Payments <br /> for{" "}
                <span className="text-[#2058BB]">Merchants</span>
                <br /> everywhere
              </p>

              <p className="text-[#666] font-figtree text-[24px] font-semibold leading-[36px] tracking-[-0.48px] text-left">
                PoolPe Business - Discover our innovative payment app for a
                seamless and secure way to accept payments from your customers
              </p>

              <div className="w-[150%] max-w-[50vw] my-8">
                <DownloadButton />
              </div>
            </div>

            <div className="relative max-w-[145%] w-[50%] h-[150%] p-1">
              <div className="w-[53rem] h-[43rem] rounded-[15px] relative z-10">
                  {/* Frame 930 */}
                  {imageArray.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Frame ${index}`}
                className={`absolute w-full h-full rounded-md transition-transform duration-1000 ease-in-out ${
                  currentFlippedIndex === index ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-180"
                }`}
              />
            ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="h-[600px] flex justify-center items-center w-full mt-[10vh] mx-auto border border-red-500">
          <div className="flex flex-col justify-end items-center max-w-[1260px] w-full">
            <div ref={slideUpRef} className="mt-[9vh] w-full">
              <p
                className={`text-[#1E1E1E] font-figtree  text-center text-[56px] font-bold leading-[64px] mb-4 text-left tracking-[-0.72px] ${
                  isSlideUpVisible ? "motion-safe:animate-slide-up" : ""
                }`}
              >
                PoolPe Business is for{" "}
                <span className="text-[#2058BB]">Everyone</span>
              </p>
              <div className="flex items-center w-full">
                {/* Left Section */}
                <div className="w-1/2 flex-shrink-0">
                  <HomeScreenMock />
                </div>

                {/* Right Section */}
                <div className=" font-inter w-1/2 p-4 flex-shrink-0">
                  <div>
                    <p className="text-left text-[18px]  align-stretch py-[2rem]">
                      <span className="text-left  align-stretch text-black font-figtree text-2xl font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        🛠️ Manage Business Details:
                      </span>{" "}
                      Update account and business details easily with a
                      user-friendly interface.
                    </p>

                    <p className="mb-4 text-[18px] text-left align-stretch py-[2rem]">
                      <span className=" text-left align-stretch text-black font-figtree text-2xl font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        📊 Track Your Earnings:
                      </span>{" "}
                      Monitor transactions and settlements in real-time for
                      better financial control.
                    </p>
                    <p className="mb-4 text-left text-[18px] align-stretch py-[2rem]">
                      <span className="text-left align-stretch text-black font-figtree text-2xl font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        🔒 Secure and Trusted:
                      </span>{" "}
                      Industry-standard encryption to keep your business data
                      safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* shadow-md */}
        {/* Feature */}
        <div className="w-[112%] ml-[-6vh]  ">
          <div className="bg-white rounded-lg p-10  max-w-[291vh] mx-auto">
            {/* Header */}
            {/* <div className="mb-6" > */}
            <div ref={slideUpRef2}>
              <p
                className={`text-3xl font-bold text-center py-5 leading-none tracking-[-0.72px] ${
                  isSlideUpVisible2 ? "motion-safe:animate-slide-up" : ""
                }`}
              >
                {/* Some Excellent{" "} */}
                <span className="text-[#2058BB] font-inter text-[36px] font-semibold leading-normal tracking-[-0.96px]">
                  {" "}
                  Features
                </span>
              </p>
            </div>

            {/* Feature 1: Image Left, Text Right */}

            <div className="flex items-start justify-between space-x-6 max-w-7xl mx-auto text-left">
              <div className="flex flex-row ">
                <div className="font-inter text-center py-3">
                  <img
                    src={servicepng1}
                    alt="Feature 2"
                    className="w-[280px] ml-[3rem]  h-[250px] rounded-md  -mt-7"
                  />
                  <p className=" ml-[3rem] text-[#3062BD]">
                    Smile with every Transaction
                  </p>
                </div>
              </div>
              <div className="w-[45%]">
                <p className="text-[#2058BB] font-figtree text-[20px] font-bold leading-none mb-4">
                  Integrated Payment Gateway
                </p>
                <p className="text-gray-700 font-inter text-xl">
                  Accept all payment modes through one unified platform. Say
                  goodbye to payment hassles. Seamlessly manage transactions,
                  boost efficiency, and simplify your business with a single
                  payment solution.
                </p>
              </div>
            </div>

            {/* Feature 2: Text Left, Image Right */}
            <div className="flex items-start justify-between space-x-6 py-6 max-w-7xl mx-auto text-left">
              <div className="w-[45%]">
                <p className="text-[#2058BB] font-figtree text-[20px] font-bold leading-none mb-4">
                  Payment
                </p>
                <p className="text-gray-700 text-xl font-inter">
                  Accept all payment modes through one unified platform. Say
                  goodbye to payment hassles. Seamlessly manage transactions,
                  boost efficiency, and simplify your business with a single
                  payment solution.
                </p>
              </div>
              {/* h-auto */}
              <div className="flex flex-row ">
                <div className="font-inter text-center">
                  <img
                    src={servicepng2}
                    alt="Feature 2"
                    className="w-[280px] mr-[3rem] h-[250px] rounded-md   -mt-7"
                  />
                  <p className="text-center mr-[19rem] text-[#3062BD]">
                    For Every Age & Every Business
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Image Left, Text Right */}
            <div className="flex items-start justify-between space-x-6 py-3 max-w-7xl mx-auto text-left ">
              <div>
                <div className="flex flex-row ">
                  <div className="font-inter text-center py-1">
                    <img
                      src={servicepng3}
                      alt="Feature 2"
                      className="w-[280px] ml-[3rem]  h-[250px] rounded-md  -mt-11"
                    />
                    <p className=" ml-[3rem] text-[#3062BD]">
                      Empowering Small Businesses
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-[45%]">
                <p className="text-[#2058BB] font-figtree text-[20px] font-bold leading-none mb-4 ">
                  Gateway
                </p>
                <p className="text-gray-700 mr-5 text-xl font-inter">
                  Accept all payment modes through one unified platform. Say
                  goodbye to payment hassles. Seamlessly manage transactions,
                  boost efficiency, and simplify your business with a single
                  payment solution.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="background-[#fff] w-full">
          <div className=" py-1">
            <div className="flex flex-row items-center justify-center space-x-6">
              <h1 className="text-[#2058BB] text-black text-center font-inter text-3xl font-bold leading-[50px] ">
                Transform your Payment Journey with{" "}
                <span className="text-[#2058BB]">Poolpe Business</span>
              </h1>

              <div className="w-[26%] max-w-[20vw]  font-inter  rounded-lg flex justify-center items-center h-[70px]">
                <DownloadButton />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div>
          <div className="w-[110%]  max-w-full ">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
