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
  name: "",
  city: "",
  address: "",
  phone: "",
  is_active: true,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1" || v === "ACTIVE";
const toStatus = (v) => (toBool(v) ? "ACTIVE" : "INACTIVE");

/* ================= PAGE ================= */

const AdminBranchesPage = () => {
  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("branches");

  const {
    data: branches = [],
    isLoading,
    isError,
  } = useGetAll({ staleTime: 1000 * 30 });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /* ================= STATE ================= */
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

  /* ================= CRUD HOOK ================= */
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
    entityName: "chi nhánh",
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
    setForm(initialForm);
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (branch) => {
    setEditing(branch);
    setForm({
      name: branch.name || "",
      city: branch.city || "",
      address: branch.address || "",
      phone: branch.phone || "",
      is_active: toBool(branch.status || "ACTIVE"),
    });
    setShowModal(true);
  };

  /* ================= SUBMIT (QUAN TRỌNG) ================= */
  const handleSubmitBranch = (e) => {
    const payload = {
      name: form.name,
      city: form.city || null,
      address: form.address || null,
      phone: form.phone || null,
      status: toStatus(form.is_active),
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredBranches = useMemo(() => {
    return branches
      .filter((b) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        return (
          b.name?.toLowerCase().includes(keyword) ||
          b.city?.toLowerCase().includes(keyword) ||
          b.address?.toLowerCase().includes(keyword) ||
          b.phone?.toLowerCase().includes(keyword)
        );
      })
      .filter((b) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(b.status)
          : !toBool(b.status);
      });
  }, [branches, search, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBranches, currentPage]);

  // Reset về trang 1 khi search/filter thay đổi
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
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
    DEFAULT: {
      className: "bg-gray-100 text-gray-700",
    },
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý chi nhánh
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý toàn bộ chi nhánh công ty
        </p>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredBranches.length}
          totalCount={branches.length}
        />

        <DynamicTable
          data={paginatedBranches}
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
              key: "name",
              title: "Tên chi nhánh",
              render: (row) => (
                <span className="font-semibold text-gray-900">
                  {row.name}
                </span>
              ),
            },
            {
              key: "city",
              title: "Thành phố",
              render: (row) => row.city || "-",
            },
            {
              key: "address",
              title: "Địa chỉ",
              render: (row) => row.address || "-",
            },
            {
              key: "phone",
              title: "Số điện thoại",
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

        <CreateButton label="Thêm chi nhánh" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa chi nhánh" : "Tạo chi nhánh mới"}
        form={form}
        fields={[
          {
            name: "name",
            type: "text",
            label: "Tên chi nhánh",
            required: true,
          },
          {
            name: "city",
            type: "text",
            label: "Thành phố",
            required: false,
          },
          {
            name: "address",
            type: "text",
            label: "Địa chỉ",
            required: false,
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
        onSubmit={handleSubmitBranch}
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

export default AdminBranchesPage;