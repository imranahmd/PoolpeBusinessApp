import React from "react";
import DownloadButton from "../components/DownloadButton";
import HomeScreenMock from "../components/HomeScreenMock";
import Footer from "./Footer";

import { useInView } from "react-intersection-observer"; // Import the hook
import amico from "../Images/ImagesSvg/amico.svg";
import BottomNav from "../Images/ImagesSvg/BottomNav.svg";

import Heroanime from "../Images/HeroAnimation.gif";

export default function Home2() {
  const { ref: slideUpRef, inView: isSlideUpVisible } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });
  const { ref: slideUpRef2, inView: isSlideUpVisible2 } = useInView({
    triggerOnce: true, // Trigger once when it enters the viewport
    threshold: 0.2, // Trigger when 20% of the element is in view
  });

  return (
    <>
      <div
        className=" min-h-screen p-5 w-fill font-inter"
        // style={{ background: "#F8F9FA" }}
        // style={{marginLeft: "-10vh",background: "#F8F9FA" }}
        style={{ marginLeft: "-10vh" }}
      >
        {/* Transforming  */}
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between">
            {/* Left Section */}
            <div className="max-w-[50%] p-4">
              <p className="text-[#000F3B] text-[22px] text-left leading-[45px] font-poppins mb-[35px]">
                Introducing{" "}
                <span className="text-[#2B7BFF]">PoolPe Business</span>
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

            {/* Mobile Video Section */}
            {/* Mobile Video Section */}
            {/* Mobile Video Section */}
            <div className="relative max-w-[145%] w-[50%] h-[150%] p-1">
              {/* SVG Circle Background */}
              <svg
                width="95.6875rem"
                height="90rem"
                viewBox="0 0 1531 1440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 left-0 w-full h-full z-0"
              >
                <ellipse
                  cx="765.5"
                  cy="720"
                  rx="565.5"
                  ry="520"
                  fill="#2058BB"
                  fillOpacity="0.1"
                />
              </svg>

              {/* GIF Image */}
              <div className="w-full h-full rounded-[15px] relative z-10">
                <img
                  className="w-full h-full object-fill"
                  src={Heroanime} // Replace with your GIF file URL
                  alt="Animated GIF"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="h-[600px] flex justify-center items-center w-full mt-[10vh] mx-auto border border-red-500">
          <div className="flex flex-col justify-end items-center max-w-[1260px] w-full">
            {/* Slide Up Animation Trigger */}
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
                    <p className="text-left align-stretch">
                      <span className="text-left align-stretch text-black font-figtree text-2xl font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        🛠️ Manage Business Details:
                      </span>{" "}
                      Update account and business details easily with a
                      user-friendly interface.
                    </p>

                    <p className="mb-4 text-left align-stretch">
                      <span className=" text-left align-stretch text-black font-figtree text-2xl font-semibold leading-normal tracking-[-0.04rem] capitalize">
                        📊 Track Your Earnings:
                      </span>{" "}
                      Monitor transactions and settlements in real-time for
                      better financial control.
                    </p>
                    <p className="mb-4 text-left align-stretch">
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
                <img
                  src={amico}
                  alt="Feature 1"
                  className="w-[320px] h-[276px] rounded-md -mt-7"
                />
                <img
                  src={BottomNav}
                  alt="Feature 2"
                  className="w-[320px]  h-[250px] rounded-md  -mt-7"
                />
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
                <img
                  src={amico}
                  alt="Feature 1"
                  className="w-[320px] h-[276px] rounded-md -mt-7"
                />
                <img
                  src={BottomNav}
                  alt="Feature 2"
                  className="w-[320px]  h-[250px] rounded-md  -mt-7"
                />
              </div>
            </div>

            {/* Feature 3: Image Left, Text Right */}
            <div className="flex items-start justify-between space-x-6 py-3 max-w-7xl mx-auto text-left ">
              <div>
                <div className="flex flex-row ">
                  <img
                    src={amico}
                    alt="Feature 1"
                    className="w-[320px] h-[276px] rounded-md -mt-7 mt-[-2.75rem]"
                  />
                  <img
                    src={BottomNav}
                    alt="Feature 2"
                    className="w-[319px] h-[300px] rounded-md  -mt-11"
                  />
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

// width: 95.6875rem;
// height: 90rem;
// flex-shrink: 0;
