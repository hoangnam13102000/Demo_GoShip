const InputField = ({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  rightElement,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-11 pr-12 py-3 border-2 rounded-lg focus:outline-none transition
            ${
              error
                ? "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-600"
            }`}
        />

        {rightElement}
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default InputField;
