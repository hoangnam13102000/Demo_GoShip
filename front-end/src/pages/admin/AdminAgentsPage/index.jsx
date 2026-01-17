import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";
import PermissionGuard from "../../../components/auth/PermissionGuard";
import RoleBasedContent from "../../../components/auth/RoleBasedContent";
import { useCurrentUserWithAgent } from "../../../utils/auth/useCurrentUser";

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

/* ================= PAGE ================= */
const AdminAgentsPage = () => {
  /* ================= USER INFO ================= */
  const {
    agent,
    branchId,
    branchName,
    isLoading: loadingUser,
    isAdmin,
    isAgent,
    hasBranch,
  } = useCurrentUserWithAgent();

  /* ================= API ================= */
  const { useGetAll, useUpdate, useDelete } = useCRUDApi("agents");

  const { data: agents = [], isLoading, isError } = useGetAll({
    staleTime: 30000,
    select: (data) => {
      if (isAdmin) return data;
      if (!branchId) return [];
      return data.filter((agent) => agent.branch_id == branchId);
    },
  });

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

  const handleEdit = (agent) => {
    setEditing(agent);
    setForm({
      full_name: agent.full_name || "",
      email: agent.account?.email || "",
      phone: agent.phone || "",
      address: agent.address || "",
      branch_id: agent.branch_id || branchId,
      role: agent.account?.role || "AGENT",
      is_active: toBool(agent.status || "ACTIVE"),
      password: "",
      confirm_password: "",
    });
    setShowModal(true);
  };

  const handleSubmitAgent = (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirm_password) {
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
      phone: form.phone,
      address: form.address,
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
          agent.branch?.name,
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

  /* ================= BADGE CONFIG ================= */
  const STATUS_BADGE_CONFIG = {
    ACTIVE: { className: "bg-green-100 text-green-700", dotColor: "bg-green-500" },
    INACTIVE: { className: "bg-red-100 text-red-700", dotColor: "bg-red-500" },
  };

  const ROLE_BADGE_CONFIG = {
    AGENT: { className: "bg-blue-100 text-blue-700", dotColor: "bg-blue-500" },
    USER: { className: "bg-gray-100 text-gray-700", dotColor: "bg-gray-500" },
  };

  /* ================= UI ================= */
  return (
    <PermissionGuard allowedRoles={["ADMIN", "AGENT"]}>
      <div className="min-h-screen p-6 bg-slate-50">
        <FilterBar
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          filterStatus={filterStatus}
          setFilterStatus={(v) => {
            setFilterStatus(v);
            setCurrentPage(1);
          }}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAgents.length}
          totalCount={agents.length}
        />

        <DynamicTable
          data={paginatedAgents}
          isLoading={isLoading || loadingUser}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) =>
                (currentPage - 1) * itemsPerPage + i + 1,
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
          ]}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* FORM CHỈ DÙNG ĐỂ EDIT */}
        <DynamicForm
          visible={showModal}
          title="Chỉnh sửa nhân viên"
          form={form}
          fields={[
            { name: "full_name", type: "text", label: "Họ tên", required: true },
            { name: "email", type: "email", label: "Email", readOnly: true },
            { name: "phone", type: "text", label: "Số điện thoại" },
            { name: "address", type: "text", label: "Địa chỉ" },
            {
              name: "role",
              type: "select",
              label: "Vai trò",
              options: ROLE_OPTIONS.map((r) => ({
                value: r,
                label: r === "AGENT" ? "Nhân viên" : "Người dùng",
              })),
            },
            { name: "password", type: "password", label: "Mật khẩu mới" },
            { name: "confirm_password", type: "password", label: "Xác nhận mật khẩu" },
          ]}
          editing={editing}
          successMessage={successMessage}
          isSubmitting={updateMutation.isPending}
          onChange={handleChange}
          onSubmit={handleSubmitAgent}
          onCancel={resetForm}
        />

        <DynamicDialog
          open={dialog.open}
          mode={dialog.mode}
          title={dialog.title}
          message={dialog.message}
          onClose={() => setDialog({ ...dialog, open: false })}
          onConfirm={dialog.onConfirm}
        />
      </div>
    </PermissionGuard>
  );
};

export default AdminAgentsPage;
