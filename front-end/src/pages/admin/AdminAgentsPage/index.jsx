import { useState, useMemo } from "react";
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

/* ================= INITIAL FORM ================= */

const initialForm = {
  account_id: "",
  branch_id: "",
  phone: "",
  is_active: true,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1" || v === "ACTIVE";
const toBit = (v) => (toBool(v) ? 1 : 0);
const toStatus = (v) => (toBool(v) ? "ACTIVE" : "INACTIVE");

/* ================= PAGE ================= */

const AdminAgentsPage = () => {
  // ================= API =================
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("agents");

  const {
    data: agents = [],
    isLoading,
    isError,
  } = useGetAll({ staleTime: 1000 * 30 });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  // ================= STATE =================
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(false);
    setSuccessMessage("");
  };

  // ================= CRUD HOOK =================
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
    entityName: "agent",
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (agent) => {
    setEditing(agent);
    setForm({
      account_id: agent.account_id || "",
      branch_id: agent.branch_id || "",
      phone: agent.phone || "",
      is_active: toBool(agent.status || "ACTIVE"),
    });
    setShowModal(true);
  };

  // ================= SUBMIT (QUAN TRỌNG) =================
  const handleSubmitAgent = (e) => {
    const payload = {
      account_id: form.account_id,
      branch_id: form.branch_id,
      phone: form.phone,
      status: toStatus(form.is_active),
    };

    handleSubmit(e, editing, payload);
  };

  // ================= FILTER =================
  const filteredAgents = useMemo(() => {
    return agents
      .filter((agent) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        return (
          String(agent.account_id).includes(keyword) ||
          String(agent.branch_id).includes(keyword) ||
          agent.phone?.toLowerCase().includes(keyword)
        );
      })
      .filter((agent) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(agent.status)
          : !toBool(agent.status);
      });
  }, [agents, search, filterStatus]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  // Reset về trang 1 khi search/filter thay đổi
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // ================= BADGE CONFIG =================
  const STATUS_BADGE_CONFIG = {
    ACTIVE: {
      className: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    INACTIVE: {
      className: "bg-red-100 text-red-700",
      dotColor: "bg-red-500",
    },
    DEFAULT: {
      className: "bg-gray-100 text-gray-700",
    },
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Agent
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý thông tin Agent theo chi nhánh
        </p>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAgents.length}
          totalCount={agents.length}
        />

        <DynamicTable
          data={paginatedAgents}
          isLoading={isLoading}
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
              key: "account_id",
              title: "Account ID",
              render: (row) => row.account_id,
            },
            {
              key: "branch_id",
              title: "Chi nhánh",
              render: (row) => row.branch_id,
            },
            {
              key: "phone",
              title: "SĐT",
              render: (row) => row.phone || "-",
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
              render: (row) =>
                row.created_at
                  ? new Date(row.created_at).toLocaleDateString("vi-VN")
                  : "-",
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <CreateButton label="Thêm Agent" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa Agent" : "Tạo Agent mới"}
        form={form}
        fields={[
          {
            name: "account_id",
            type: "number",
            label: "Account ID",
            required: true,
          },
          {
            name: "branch_id",
            type: "number",
            label: "Chi nhánh",
            required: true,
          },
          {
            name: "phone",
            type: "text",
            label: "Số điện thoại",
            required: false,
          },
          {
            name: "is_active",
            type: "checkbox",
            label: "Kích hoạt",
          },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={handleSubmitAgent}
        onCancel={resetForm}
      />

      {/* DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={async () => {
          if (dialog.onConfirm) {
            await dialog.onConfirm();
          }
        }}
      />
    </div>
  );
};

export default AdminAgentsPage;