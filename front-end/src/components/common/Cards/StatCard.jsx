const COLOR_MAP = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
};

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  return (
    <div
      className="
        bg-white border rounded-xl shadow
        flex items-center gap-4
        p-4 sm:p-5 lg:p-6
        transition hover:shadow-lg
      "
    >
      {/* Icon */}
      <div
        className={`
          ${COLOR_MAP[color]}
          p-3 sm:p-4
          rounded-full
          text-xl sm:text-2xl
          flex items-center justify-center
        `}
      >
        <Icon />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-gray-500 text-xs sm:text-sm">
          {title}
        </p>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
