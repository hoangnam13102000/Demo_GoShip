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

const STATUS_OPTIONS = ["PAID", "UNPAID"];

/* ================= INITIAL FORM ================= */

const initialForm = {
  shipment_id: "",
  base_amount: "",
  weight_fee: "",
  tax: "",
  total_amount: "",
  is_paid: false,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1" || v === "PAID";
const toStatus = (v) => (toBool(v) ? "PAID" : "UNPAID");

/* ================= PAGE ================= */

const AdminBillsPage = () => {
  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("bills");

  const {
    data: bills = [],
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
    entityName: "hóa đơn",
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

  const handleEdit = (bill) => {
    setEditing(bill);
    setForm({
      shipment_id: bill.shipment_id || "",
      base_amount: bill.base_amount ?? "",
      weight_fee: bill.weight_fee ?? "",
      tax: bill.tax ?? "",
      total_amount: bill.total_amount ?? "",
      is_paid: toBool(bill.status || "UNPAID"),
    });
    setShowModal(true);
  };

  /* ================= SUBMIT (QUAN TRỌNG) ================= */
  const handleSubmitBill = (e) => {
    const payload = {
      shipment_id: Number(form.shipment_id),
      base_amount: Number(form.base_amount),
      weight_fee: Number(form.weight_fee),
      tax: Number(form.tax),
      total_amount: Number(form.total_amount),
      status: toStatus(form.is_paid),
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredBills = useMemo(() => {
    return bills
      .filter((b) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        return (
          String(b.id).includes(keyword) ||
          String(b.shipment_id).includes(keyword) ||
          String(b.total_amount).includes(keyword)
        );
      })
      .filter((b) => {
        if (filterStatus === "ALL") return true;
        return b.status === filterStatus;
      });
  }, [bills, search, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBills, currentPage]);

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
    PAID: {
      className: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    UNPAID: {
      className: "bg-yellow-100 text-yellow-700",
      dotColor: "bg-yellow-500",
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
          Quản lý hóa đơn
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý toàn bộ hóa đơn vận chuyển
        </p>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredBills.length}
          totalCount={bills.length}
        />

        <DynamicTable
          data={paginatedBills}
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
              key: "id",
              title: "Mã hóa đơn",
              render: (row) => (
                <span className="font-mono font-semibold text-blue-600">
                  #{row.id}
                </span>
              ),
            },
            {
              key: "shipment_id",
              title: "Mã vận đơn",
              render: (row) => (
                <span className="text-gray-700">#{row.shipment_id}</span>
              ),
            },
            {
              key: "base_amount",
              title: "Giá cơ bản",
              render: (row) =>
                Number(row.base_amount).toLocaleString("vi-VN") + "đ",
            },
            {
              key: "weight_fee",
              title: "Phí trọng lượng",
              render: (row) =>
                Number(row.weight_fee).toLocaleString("vi-VN") + "đ",
            },
            {
              key: "tax",
              title: "Thuế",
              render: (row) =>
                Number(row.tax).toLocaleString("vi-VN") + "đ",
            },
            {
              key: "total_amount",
              title: "Tổng tiền",
              render: (row) => (
                <span className="font-semibold text-lg text-blue-600">
                  {Number(row.total_amount).toLocaleString("vi-VN")}đ
                </span>
              ),
            },
            {
              key: "status",
              title: "Trạng thái",
              render: (row) => (
                <GenericBadge
                  value={row.status || "UNPAID"}
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

        <CreateButton label="Tạo hóa đơn" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn mới"}
        form={form}
        fields={[
          {
            name: "shipment_id",
            type: "number",
            label: "Mã vận đơn",
            required: true,
            readOnly: editing ? true : false,
          },
          {
            name: "base_amount",
            type: "number",
            label: "Giá cơ bản (đ)",
            required: true,
            step: "0.01",
          },
          {
            name: "weight_fee",
            type: "number",
            label: "Phí trọng lượng (đ)",
            required: false,
            step: "0.01",
          },
          {
            name: "tax",
            type: "number",
            label: "Thuế (đ)",
            required: false,
            step: "0.01",
          },
          {
            name: "total_amount",
            type: "number",
            label: "Tổng tiền (đ)",
            required: true,
            step: "0.01",
          },
          {
            name: "is_paid",
            type: "checkbox",
            label: "Đã thanh toán",
          },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={handleSubmitBill}
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

export default AdminBillsPage;