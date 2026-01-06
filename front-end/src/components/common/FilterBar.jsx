import { FaSearch } from "react-icons/fa";

const FilterBar = ({
  search,
  setSearch,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  roleOptions = [],       
  statusOptions = [],      
  filteredCount,
  totalCount,
}) => {
  const showRoleFilter = Array.isArray(roleOptions) && roleOptions.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
      <div
        className={`grid grid-cols-1 gap-4 mb-4 ${
          showRoleFilter ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {/* SEARCH */}
        <div
          className={`relative ${
            showRoleFilter ? "md:col-span-2" : "md:col-span-1"
          }`}
        >
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              showRoleFilter
                ? "Tìm kiếm theo email hoặc vai trò..."
                : "Tìm kiếm..."
            }
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl"
          />
        </div>

        {/* ROLE FILTER  */}
        {showRoleFilter && (
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl"
          >
            <option value="ALL">Tất cả vai trò</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        )}

        {/* STATUS FILTER */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl"
        >
          <option value="ALL">Tất cả trạng thái</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600">
        Hiển thị {filteredCount} / {totalCount}
      </div>
    </div>
  );
};

export default FilterBar;
