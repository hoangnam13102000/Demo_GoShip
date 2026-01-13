import { FaFileExcel, FaFilePdf, FaShareAlt } from "react-icons/fa";

const ExportButtons = ({
  onExportExcel,
  onExportPDF,
  onExportOther,
  size = "md", // md hoặc sm
}) => {
  const btnClass = size === "sm"
    ? "px-3 py-2 text-sm"
    : "px-4 py-3 text-base";

  return (
    <div className="flex gap-3">
      {onExportExcel && (
        <button
          onClick={onExportExcel}
          className={`${btnClass} bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition duration-200`}
        >
          <FaFileExcel /> Excel
        </button>
      )}
      {onExportPDF && (
        <button
          onClick={onExportPDF}
          className={`${btnClass} bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 transition duration-200`}
        >
          <FaFilePdf /> PDF
        </button>
      )}
      {onExportOther && (
        <button
          onClick={onExportOther}
          className={`${btnClass} bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 transition duration-200`}
        >
          <FaShareAlt /> Khác
        </button>
      )}
    </div>
  );
};

export default ExportButtons;
