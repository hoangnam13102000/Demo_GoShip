import {
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const DynamicTable = ({
  columns,
  data,
  isLoading,
  isError,
  onEdit,
  onDelete,
  rowKey = "id",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 font-semibold text-gray-700 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.title}
                </th>
              ))}
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <FaSpinner className="animate-spin text-indigo-600" size={24} />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <FaExclamationCircle className="text-red-500" size={24} />
                    <p className="text-red-600">Có lỗi khi tải dữ liệu</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <FaExclamationCircle className="text-gray-400" size={24} />
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
                      className={`px-6 py-3 ${
                        col.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {col.render
                        ? col.render(row, index)
                        : row[col.dataIndex] ?? "-"}
                    </td>
                  ))}

                  {/* ACTIONS */}
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                      >
                        <FaEdit size={16} />
                        <span className="hidden sm:inline text-sm font-medium">
                          Sửa
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
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
    </div>
  );
};

export default DynamicTable;
