import React from "react";

const MapView = () => {
  // Address for the map (you can dynamically pass this as props or state)
  const address = "1600 Amphitheatre Parkway, Mountain View, CA";
  
  // Replace spaces with "+" for embedding
  const formattedAddress = address.replace(/\s/g, "+");
  window.open(
    `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formattedAddress}`,
    "_blank"
  );
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">View Map</h2>
      <iframe
        title="Google Map"
        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formattedAddress}`}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
      <p className="mt-4 text-gray-600">{address}</p>
    </div>
  );
};

export default MapView;
