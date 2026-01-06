import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

const DynamicForm = ({
  visible,
  title,
  form,
  fields,
  editing,
  successMessage,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
  error,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-4 sm:px-6 py-6 sm:py-7 text-white border-b border-slate-700">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                {title}
              </h2>
              {editing && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Cập nhật thông tin của bạn
                </p>
              )}
            </div>
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition flex-shrink-0 disabled:opacity-50"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-7">
          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-5 sm:mb-6 flex items-start gap-3 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
              <FaCheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5 w-5 h-5" />
              <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 sm:mb-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
              <FaExclamationCircle className="text-red-600 flex-shrink-0 mt-0.5 w-5 h-5" />
              <p className="text-xs sm:text-sm text-red-800 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* FIELDS */}
          <div className="space-y-5 sm:space-y-6">
            {fields.map((field, idx) => {
              if (field.hideWhenEdit && editing) return null;
              if (field.hideWhenCreate && !editing) return null;

              const fieldValue = form[field.name];
              const isRequired = field.required ?? true;

              if (field.type === "select") {
                return (
                  <div key={field.name} className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-2.5">
                      {field.label || field.name}
                      {isRequired && (
                        <span className="text-rose-500 ml-1.5">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        name={field.name}
                        value={fieldValue || ""}
                        onChange={onChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition appearance-none cursor-pointer hover:border-blue-300 group-hover:border-blue-300 group-hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                        required={isRequired}
                      >
                        <option value="">
                          {field.placeholder ||
                            `Chọn ${field.label || field.name}`}
                        </option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {field.hint && (
                      <p className="text-xs text-slate-600 mt-2">
                        {field.hint}
                      </p>
                    )}
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="group">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-2.5">
                      {field.label || field.name}
                      {isRequired && (
                        <span className="text-rose-500 ml-1.5">*</span>
                      )}
                    </label>
                    <textarea
                      name={field.name}
                      value={fieldValue || ""}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition resize-none hover:border-blue-300 group-hover:border-blue-300 group-hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                      required={isRequired}
                    />
                    {field.hint && (
                      <p className="text-xs text-slate-600 mt-2">
                        {field.hint}
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <div key={field.name} className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-2.5">
                    {field.label || field.name}
                    {isRequired && (
                      <span className="text-rose-500 ml-1.5">*</span>
                    )}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={fieldValue || ""}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition hover:border-blue-300 group-hover:border-blue-300 group-hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                    required={isRequired}
                    min={field.min}
                    max={field.max}
                  />
                  {field.hint && (
                    <p className="text-xs text-slate-600 mt-2">
                      {field.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 hover:border-slate-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSubmitting && (
                <FaSpinner className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span>
                {isSubmitting
                  ? editing
                    ? "Đang lưu..."
                    : "Đang tạo..."
                  : editing
                  ? "Cập nhật"
                  : "Tạo mới"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;