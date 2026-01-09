import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ServiceCard = ({
  icon: Icon,
  title,
  desc,
  features = [],
  price,
  color,
  featured = false,
  onSelect,
}) => {
  return (
    <div
      className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        featured
          ? "bg-gradient-to-br " +
            color +
            " text-white border-2 border-transparent scale-105 sm:scale-100 lg:scale-105"
          : "bg-white border-2 border-gray-200 hover:border-blue-300"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-blue-900 text-xs sm:text-sm font-bold rounded-full">
          ⭐ PHỔ BIẾN NHẤT
        </div>
      )}

      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 ${
          featured ? "bg-white/20" : "bg-gradient-to-br " + color
        }`}
      >
        <Icon className="text-2xl sm:text-3xl text-white" />
      </div>

      <h3
        className={`text-xl sm:text-2xl font-bold mb-2 ${
          featured ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>

      <p
        className={`text-sm sm:text-base mb-6 ${
          featured ? "text-blue-50" : "text-gray-600"
        }`}
      >
        {desc}
      </p>

      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {features.map((feature, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 text-sm sm:text-base ${
              featured ? "text-blue-50" : "text-gray-600"
            }`}
          >
            <FaCheckCircle
              className={featured ? "text-blue-200" : "text-blue-600"}
            />
            {feature}
          </li>
        ))}
      </ul>

      <div
        className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${
          featured ? "text-white" : "text-blue-600"
        }`}
      >
        {price}
      </div>

      <button
        onClick={onSelect}
        className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 text-sm sm:text-base ${
          featured
            ? "bg-white text-blue-600 hover:shadow-lg hover:scale-105"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Chọn dịch vụ
      </button>
    </div>
  );
};

export default ServiceCard;
