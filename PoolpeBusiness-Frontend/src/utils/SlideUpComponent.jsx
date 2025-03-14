import React from "react";

const SlideUpComponent = ({ children }) => {
    return (
      <p
        className="leading-normal tracking-[-1.44px] text-center text-[#1E1E1E] font-figtree text-[72px] font-extrabold uppercase motion-safe:animate-slide-up"
        style={{
          color: "#1E1E1E",
          textAlign: "center",
          fontFamily: "Figtree",
          fontSize: "72px",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "normal",
          letterSpacing: "-1.44px",
          textTransform: "uppercase",
        }}
      >
        {children}
      </p>
    );
  };
  export default SlideUpComponent;
  