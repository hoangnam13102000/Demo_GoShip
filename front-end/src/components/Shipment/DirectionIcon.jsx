import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const DirectionIcon = ({ direction }) => {
  if (direction === "IN") {
    return <FaArrowLeft className="text-green-500" />;
  } else if (direction === "OUT") {
    return <FaArrowRight className="text-blue-500" />;
  }
  return null;
};

export default DirectionIcon;