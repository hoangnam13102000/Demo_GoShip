import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import CreateButton from "../../../components/common/buttons/CreateButton";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const initialForm = {
  account_id: "",
  branch_id: "",
  contact_number: "",
  status: "ACTIVE",
};

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
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      contact_number: agent.contact_number || "",
      status: agent.status || "ACTIVE",
    });
    setShowModal(true);
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
          agent.contact_number?.toLowerCase().includes(keyword)
        );
      })
      .filter((agent) =>
        filterStatus === "ALL" ? true : agent.status === filterStatus
      );
  }, [agents, search, filterStatus]);

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

        {/* FILTER BAR – KHÔNG ROLE */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAgents.length}
          totalCount={agents.length}
        />

        <DynamicTable
          data={filteredAgents}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) => i + 1,
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
              key: "contact_number",
              title: "SĐT",
              render: (row) => row.contact_number || "-",
            },
            {
              key: "status",
              title: "Trạng thái",
              render: (row) => (
                <GenericBadge
                  value={row.status}
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
          },
          {
            name: "branch_id",
            type: "number",
          },
          {
            name: "contact_number",
            type: "text",
          },
          {
            name: "status",
            type: "select",
            options: STATUS_OPTIONS.map((s) => ({
              label: s,
              value: s,
            })),
          },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={(e) => handleSubmit(e, editing, form)}
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
