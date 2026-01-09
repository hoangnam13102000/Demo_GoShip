import {
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";
import { useState } from "react";

const DynamicTable = ({
  columns,
  data,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onView,
  rowKey = "id",
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Mobile card view
  const renderMobileView = () => {
    if (isLoading) {
      return (
        <div className="p-6 text-center">
          <div className="flex justify-center items-center gap-2">
            <FaSpinner className="animate-spin text-indigo-600" size={24} />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-6 text-center">
          <div className="flex justify-center items-center gap-2">
            <FaExclamationCircle className="text-red-500" size={24} />
            <p className="text-red-600">Có lỗi khi tải dữ liệu</p>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="p-6 text-center">
          <div className="flex justify-center items-center gap-2">
            <FaExclamationCircle className="text-gray-400" size={24} />
            <p className="text-gray-600">Không tìm thấy dữ liệu</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 p-4">
        {data.map((row, index) => (
          <div
            key={row[rowKey] ?? index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* Card Header - Primary Info */}
            <button
              onClick={() =>
                setExpandedRow(
                  expandedRow === (row[rowKey] ?? index)
                    ? null
                    : row[rowKey] ?? index
                )
              }
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="text-left flex-1 min-w-0">
                {columns.slice(0, 2).map((col) => (
                  <div key={col.key}>
                    <p className="text-xs text-gray-500 font-semibold uppercase">
                      {col.title}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {col.render
                        ? col.render(row, index)
                        : row[col.dataIndex] ?? "-"}
                    </p>
                  </div>
                ))}
              </div>
              <FaChevronRight
                className={`text-gray-400 ml-2 transition transform ${
                  expandedRow === (row[rowKey] ?? index) ? "rotate-90" : ""
                }`}
                size={16}
              />
            </button>

            {/* Card Expanded Content */}
            {expandedRow === (row[rowKey] ?? index) && (
              <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                {columns.slice(2).map((col) => (
                  <div key={col.key} className="flex justify-between items-start">
                    <p className="text-xs text-gray-500 font-semibold uppercase">
                      {col.title}
                    </p>
                    <p className="text-sm text-gray-900 text-right flex-1 ml-2">
                      {col.render
                        ? col.render(row, index)
                        : row[col.dataIndex] ?? "-"}
                    </p>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 flex-wrap">
                  <button
                    onClick={() => onView && onView(row)}
                    className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                  >
                    <FaEye size={14} />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => onEdit(row)}
                    className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-sm font-medium"
                  >
                    <FaEdit size={14} />
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                  >
                    <FaTrash size={14} />
                    Xoá
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Desktop table view with horizontal scroll
  const renderDesktopView = () => {
    return (
      <div className="overflow-hidden">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 font-semibold text-gray-700 whitespace-nowrap ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.title}
                  </th>
                ))}
                <th className="px-6 py-3 text-right font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50">
                  Hành động
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-8 text-center"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <FaSpinner
                        className="animate-spin text-indigo-600"
                        size={24}
                      />
                      <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-8 text-center"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <FaExclamationCircle
                        className="text-red-500"
                        size={24}
                      />
                      <p className="text-red-600">Có lỗi khi tải dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-8 text-center"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <FaExclamationCircle
                        className="text-gray-400"
                        size={24}
                      />
                      <p className="text-gray-600">Không tìm thấy dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row[rowKey] ?? index}
                    className="hover:bg-gray-50 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-6 py-3 whitespace-nowrap ${
                          col.align === "right" ? "text-right" : ""
                        }`}
                      >
                        {col.render
                          ? col.render(row, index)
                          : row[col.dataIndex] ?? "-"}
                      </td>
                    ))}

                    {/* ACTIONS */}
                    <td className="px-6 py-3 text-right sticky right-0 bg-white hover:bg-gray-50">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
                          >
                            <FaEye size={16} />
                            <span className="hidden sm:inline text-sm font-medium">
                              Chi tiết
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition whitespace-nowrap"
                        >
                          <FaEdit size={16} />
                          <span className="hidden sm:inline text-sm font-medium">
                            Sửa
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition whitespace-nowrap"
                        >
                          <FaTrash size={16} />
                          <span className="hidden sm:inline text-sm font-medium">
                            Xoá
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default DynamicTable;