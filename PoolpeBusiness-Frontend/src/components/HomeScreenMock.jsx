import React from "react";
import Carousel from "react-bootstrap/Carousel";
import ani1 from "../Images/ani1.png";
import ani2 from "../Images/ani2.png";

const HomeScreenMock = () => {
  return (
    <div className="relative">
      <Carousel interval={1000}>
        <Carousel.Item>
          <img
            className="block mx-auto my-12 w-full h-96 object-contain" // Tailwind classes for styling
            src={ani1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="block mx-auto my-12 w-full h-96 object-contain" // Tailwind classes for styling
            src={ani2}
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HomeScreenMock;
