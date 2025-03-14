import React, { useState, useEffect } from "react";

const images = [
  // logos1,
  //  logos2,
  //  logos3,
    // logos4
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div style={{ textAlign: "center", overflow: "hidden", position: "relative" }}>
      <img
        src={images[currentIndex]}
        alt="Slider"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "calc(70vh - 15rem)", // Adjust max height with some margin
          objectFit: "cover",
          marginTop: "1rem", // Adjust margin to fit your design
          display: "block", // Remove inline spacing issues
          marginLeft: "auto",
          marginRight: "auto",
          
        }}
      />
    </div>
  );
};

export default ImageSlider;
