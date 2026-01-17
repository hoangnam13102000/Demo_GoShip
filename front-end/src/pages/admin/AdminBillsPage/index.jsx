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
};

/* ================= FORM FIELDS ================= */

const formFields = [
  {
    name: "shipment_id",
    label: "Mã vận đơn",
    type: "number",
    required: true,
    placeholder: "Nhập mã vận đơn",
    hint: "Mã vận đơn để liên kết với hóa đơn này",
    icon: "FaHashtag",
  },
  {
    name: "base_amount",
    label: "Cước cơ bản",
    type: "number",
    required: true,
    placeholder: "Nhập cước cơ bản",
    hint: "Chi phí cước vận chuyển cơ bản",
    icon: "FaDollarSign",
  },
  {
    name: "weight_fee",
    label: "Phí cân nặng",
    type: "number",
    required: false,
    placeholder: "Nhập phí cân nặng (nếu có)",
    hint: "Phụ phí theo cân nặng hàng hóa",
    icon: "FaWeight",
  },
  {
    name: "tax",
    label: "Thuế",
    type: "number",
    required: false,
    placeholder: "Nhập thuế (nếu có)",
    hint: "Thuế VAT hoặc các loại thuế khác",
    icon: "FaDollarSign",
  },
];

/* ================= PAGE ================= */

const AdminBillsPage = () => {
  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("bills");

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (bill) => {
    setEditing(bill);
    setForm({
      shipment_id: bill.shipment_id ?? "",
      base_amount: bill.base_amount ?? "",
      weight_fee: bill.weight_fee ?? "",
      tax: bill.tax ?? "",
      total_amount: bill.total_amount ?? "",
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmitBill = (e) => {
    e.preventDefault();
    
    // Tính toán total amount
    const baseAmount = Number(form.base_amount) || 0;
    const weightFee = Number(form.weight_fee) || 0;
    const tax = Number(form.tax) || 0;
    
    const payload = {
      base_amount: baseAmount,
      weight_fee: weightFee,
      tax: tax,
      total_amount: baseAmount + weightFee + tax,
    };

    if (!editing) {
      payload.shipment_id = Number(form.shipment_id);
    }

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
          String(b.total_amount).includes(keyword) ||
          b.shipment?.tracking_number?.toLowerCase().includes(keyword)
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

  /* ================= BADGE ================= */

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

  const PAYMENT_BADGE = {
    CASH: "bg-blue-100 text-blue-700",
    MOMO: "bg-pink-100 text-pink-700",
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quản lý hóa đơn</h1>

        <FilterBar
          search={search}
          setSearch={setSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
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
              key: "id",
              title: "Mã HĐ",
              render: (row) => (
                <span className="font-mono font-semibold text-blue-600">
                  #{row.id}
                </span>
              ),
            },
            {
              key: "tracking",
              title: "Mã vận đơn",
              render: (row) => (
                <span className="font-mono text-gray-800">
                  {row.shipment?.tracking_number || "--"}
                </span>
              ),
            },
            {
              key: "payment",
              title: "Thanh toán",
              render: (row) => {
                const method = row.payments?.[0]?.method;
                if (!method) return "--";
                return (
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${PAYMENT_BADGE[method]}`}
                  >
                    {method}
                  </span>
                );
              },
            },
            {
              key: "total_amount",
              title: "Tổng tiền",
              render: (row) =>
                Number(row.total_amount).toLocaleString("vi-VN") + "đ",
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
                new Date(row.created_at).toLocaleDateString("vi-VN"),
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

      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn"}
        form={form}
        fields={formFields}
        editing={editing}
        onChange={handleChange}
        onSubmit={handleSubmitBill}
        onCancel={resetForm}
        successMessage={successMessage}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
        error={createMutation.error?.message || updateMutation.error?.message}
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
  );
};

export default AdminBillsPage;