import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DownloadButton = () => {
  return (
    <div className="d-flex justify-content-start mt-8 mb-5">
      <a
        href="/PoolpeBusinessPROD.apk" // Correct path, assuming file is in the public folder
        download="PoolpeBusinessUAT0201.apk"
        className="btn btn-primary text-white"
        style={{
          backgroundColor: "#2058BB",
          fontSize: "clamp(12px, 2.5vw, 16px)",  // Responsive font size
          padding: "8px 16px", // Balanced padding for better look
          margin: "9px 2vh",
          borderRadius: "16px",
          width: "fit-content", // Width adjusts to fit content
          textAlign: "center",
          border: "none", // Removes any border
          whiteSpace: "nowrap", // Prevents text wrapping
          marginTop:"22px"
        }}
      >
        <span
          style={{
            color: "#FFF;",
            fontWeight: "bold",
            textAlign: "center",
            // border:"1px solid #FFF",
            borderRadius:"16px",
            padding:"13px 15px",
          }}
        >
          Download Poolpe Business APK
        </span>
      </a>
      
    </div>
    
  );
};

export default DownloadButton;
