import { useState, useMemo, useEffect } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import CreateButton from "../../../components/common/buttons/CreateButton";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";

/* ================= CONSTANTS ================= */
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];
const ROLE_OPTIONS = ["AGENT", "USER"];

/* ================= INITIAL FORM ================= */
const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirm_password: "",
  role: "AGENT",
  is_active: true,
};

/* ================= HELPERS ================= */
const toBool = (v) => v === true || v === 1 || v === "1" || v === "ACTIVE";
const toStatus = (v) => (toBool(v) ? "ACTIVE" : "INACTIVE");

// Hàm lấy thông tin user từ localStorage
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("auth");
    
    if (userData) {
      return JSON.parse(userData);
    }
    
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user || parsed;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Hook lấy thông tin agent hiện tại
const useCurrentAgent = () => {
  const currentUser = getCurrentUser();
  const { useGetAll } = useCRUDApi("agents");
  
  return useGetAll({
    staleTime: 30000,
    select: (data) => {
      return data.find(agent => agent.account_id === currentUser?.id);
    },
    enabled: !!currentUser?.id
  });
};

/* ================= PAGE ================= */
const BranchAgentsPage = () => {
  /* ================= USER & AGENT INFO ================= */
  const currentUser = useMemo(() => getCurrentUser(), []);
  const { data: currentAgent, isLoading: loadingAgent } = useCurrentAgent();
  
  const currentUserBranchId = currentAgent?.branch_id;
  const currentUserRole = currentUser?.role || "USER";
  const currentUserBranchName = currentAgent?.branch?.name || "Chi nhánh";

  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("agents");

  // Lấy agents theo branch
  const { data: agents = [], isLoading, isError } = useGetAll({ 
    staleTime: 30000,
    select: (data) => {
      // ADMIN xem tất cả
      if (currentUserRole === 'ADMIN') {
        return data;
      }
      
      // AGENT chỉ xem agents cùng branch
      if (!currentUserBranchId) {
        return [];
      }
      
      return data.filter(agent => agent.branch_id == currentUserBranchId);
    }
  });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /* ================= STATE ================= */
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterRole, setFilterRole] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(false);
    setSuccessMessage("");
  };

  /* ================= CRUD ================= */
  const {
    successMessage,
    setSuccessMessage,
    dialog,
    setDialog,
    handleSubmit,
    handleDelete,
  } = useHandleCRUD({
    createMutation,
    updateMutation,
    deleteMutation,
    resetForm,
    entityName: "nhân viên",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenCreate = () => {
    setForm({
      ...initialForm,
      branch_id: currentUserBranchId
    });
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (agent) => {
    setEditing(agent);
    setForm({
      full_name: agent.full_name || "",
      email: agent.account?.email || "",
      phone: agent.phone || "",
      address: agent.address || "",
      branch_id: agent.branch_id || currentUserBranchId,
      role: agent.account?.role || "AGENT",
      is_active: toBool(agent.status || "ACTIVE"),
      password: "",
      confirm_password: "",
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmitAgent = (e) => {
    e.preventDefault();
    
    // Validate
    if (!editing && (!form.password || form.password.length < 6)) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    if ((!editing || form.password) && form.password !== form.confirm_password) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      branch_id: currentUserBranchId,
      status: toStatus(form.is_active),
      role: form.role,
      ...(form.password && { password: form.password }),
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredAgents = useMemo(() => {
    return agents
      .filter((agent) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        const searchString = [
          agent.full_name,
          agent.phone,
          agent.account?.email,
          agent.branch?.name
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchString.includes(keyword);
      })
      .filter((agent) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(agent.status)
          : !toBool(agent.status);
      })
      .filter((agent) => {
        if (filterRole === "ALL") return true;
        return agent.account?.role === filterRole;
      });
  }, [agents, search, filterStatus, filterRole]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleFilterRole = (value) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  /* ================= BADGE CONFIG ================= */
  const STATUS_BADGE_CONFIG = {
    ACTIVE: {
      className: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    INACTIVE: {
      className: "bg-red-100 text-red-700",
      dotColor: "bg-red-500",
    },
  };

  const ROLE_BADGE_CONFIG = {
    AGENT: {
      className: "bg-blue-100 text-blue-700",
      dotColor: "bg-blue-500",
    },
    USER: {
      className: "bg-gray-100 text-gray-700",
      dotColor: "bg-gray-500",
    },
  };

  /* ================= FORM FIELDS ================= */
  const getFormFields = () => {
    const fields = [
      {
        name: "full_name",
        type: "text",
        label: "Họ tên",
        required: true,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        required: true,
        readOnly: !!editing,
      },
      {
        name: "phone",
        type: "text",
        label: "Số điện thoại",
        required: false,
      },
      {
        name: "address",
        type: "text",
        label: "Địa chỉ",
        required: false,
      },
      {
        name: "role",
        type: "select",
        label: "Vai trò",
        required: true,
        options: ROLE_OPTIONS.map(role => ({
          value: role,
          label: role === 'AGENT' ? 'Nhân viên' : 'Người dùng'
        }))
      },
      {
        name: "password",
        type: "password",
        label: editing ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu",
        required: !editing,
      },
      {
        name: "confirm_password",
        type: "password",
        label: "Xác nhận mật khẩu",
        required: !editing,
      },
      {
        name: "is_active",
        type: "checkbox",
        label: "Kích hoạt",
      }
    ];

    return fields;
  };

  /* ================= PERMISSION CHECK ================= */
  // Chờ load xong agent info
  if (loadingAgent || (currentUserRole === 'AGENT' && !currentAgent && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const canAccess = currentUserRole === 'ADMIN' || currentUserRole === 'AGENT';
  const hasBranch = currentUserBranchId || currentUserRole === 'ADMIN';
  
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang quản lý nhân viên.
          </p>
        </div>
      </div>
    );
  }

  if (currentUserRole === 'AGENT' && !currentUserBranchId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có chi nhánh</h2>
          <p className="text-gray-600 mb-4">
            Tài khoản của bạn chưa được gán vào chi nhánh nào.
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý nhân viên
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600">
                <span>Chi nhánh:</span>
                <span className="font-semibold text-blue-600">
                  {currentUserBranchName}
                </span>
                {currentUserRole === 'ADMIN' && (
                  <span className="text-sm px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    Quản trị viên
                  </span>
                )}
                {currentUserRole === 'AGENT' && (
                  <span className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Quản lý chi nhánh
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Mã chi nhánh: {currentUserBranchId} • Tổng nhân viên: {agents.length}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                Đang hiển thị: <span className="font-bold">{filteredAgents.length}</span>/{agents.length}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin nhân viên thuộc chi nhánh của bạn
          </p>
        </div>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAgents.length}
          totalCount={agents.length}
          additionalFilters={[
            {
              label: "Vai trò",
              value: filterRole,
              onChange: handleFilterRole,
              options: [
                { value: "ALL", label: "Tất cả vai trò" },
                ...ROLE_OPTIONS.map(role => ({
                  value: role,
                  label: role === 'AGENT' ? 'Nhân viên' : 'Người dùng'
                }))
              ]
            }
          ]}
        />

        {/* AGENTS TABLE */}
        <DynamicTable
          data={paginatedAgents}
          isLoading={isLoading || loadingAgent}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) => (currentPage - 1) * itemsPerPage + i + 1,
            },
            {
              key: "full_name",
              title: "Họ tên",
              render: (row) => row.full_name || "-",
            },
            {
              key: "email",
              title: "Email",
              render: (row) => row.account?.email || "-",
            },
            {
              key: "phone",
              title: "Số điện thoại",
              render: (row) => row.phone || "-",
            },
            {
              key: "address",
              title: "Địa chỉ",
              render: (row) => row.address || "-",
            },
            {
              key: "branch",
              title: "Chi nhánh",
              render: (row) => row.branch?.name || "-",
            },
            {
              key: "role",
              title: "Vai trò",
              render: (row) => (
                <GenericBadge
                  value={row.account?.role || "AGENT"}
                  config={ROLE_BADGE_CONFIG}
                />
              ),
            },
            {
              key: "status",
              title: "Trạng thái",
              render: (row) => (
                <GenericBadge
                  value={row.status || "ACTIVE"}
                  config={STATUS_BADGE_CONFIG}
                />
              ),
            },
            {
              key: "created_at",
              title: "Ngày tạo",
              render: (row) => row.created_at 
                ? new Date(row.created_at).toLocaleDateString('vi-VN') 
                : "-",
            },
          ]}
        />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* CREATE BUTTON */}
        {(currentUserRole === 'ADMIN' || (currentUserRole === 'AGENT' && currentUserBranchId)) && (
          <CreateButton 
            label="Thêm nhân viên mới" 
            onClick={handleOpenCreate}
          />
        )}
      </div>

      {/* FORM MODAL */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa nhân viên" : "Tạo nhân viên mới"}
        form={form}
        fields={getFormFields()}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={handleSubmitAgent}
        onCancel={resetForm}
      />

      {/* CONFIRM DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default BranchAgentsPage;