// import React from "react";
// import { motion } from "framer-motion";
// import zooming from "../Images/ImagesSvg/unnamed (1).png";

// const ZoomImage = () => {
//   return (
//     <motion.img
//   src={zooming}
//   alt="Zoom Animation"
//   className="block" // Tailwind classes for styling
//   initial={{ scale: 0.5 }} // Initial scale (small)
//   animate={{ scale: 1 }} // Final scale (normal size)
//   whileHover={{ scale: 1.2 }} // Hover animation (zooms further)
//   transition={{ duration: 2, ease: "easeInOut" }} // Animation transition
//   style={{ marginLeft: '-8rem' }} // Inline style to ensure the margin is applied
// />

//   );
// };

// export default ZoomImage;


import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import zooming from "../Images/ImagesSvg/unnamed (1).png";

const ZoomImage = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.2, // Trigger when 20% of the image is visible
  });

  return (
    <motion.img
      ref={ref}
      src={zooming}
      alt="Zoom Animation"
      className="block mx-auto "
      initial={{ scale: 0.5, opacity: 0 }} // Start small and hidden
      animate={inView ? { scale: 1, opacity: 1 } : {}} // Animate when in view
      whileHover={{ scale: 1.2 }} // Slight zoom on hover
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{ marginLeft: "-8rem" }}
    />
  );
};

export default ZoomImage;
