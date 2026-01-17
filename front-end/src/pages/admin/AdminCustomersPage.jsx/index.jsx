import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";

/* ================= CONSTANTS ================= */

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

/* ================= INITIAL FORM ================= */

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  is_active: true,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1" || v === "ACTIVE";
const toStatus = (v) => (toBool(v) ? "ACTIVE" : "INACTIVE");

/* ================= PAGE ================= */

const AdminCustomersPage = () => {
  /* ================= API ================= */
  const { useGetAll, useUpdate, useDelete } = useCRUDApi("customers");

  const { data: customers = [], isLoading, isError } = useGetAll({
    staleTime: 30000,
  });

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
    entityName: "khách hàng",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    setForm({
      full_name: customer.full_name ?? "",
      email: customer.account?.email ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      is_active: toBool(customer.status || "ACTIVE"),
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmitCustomer = (e) => {
    const payload = {
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
      status: toStatus(form.is_active),
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();

        return [c.full_name, c.phone, c.address, c.account?.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      })
      .filter((c) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(c.status)
          : !toBool(c.status);
      });
  }, [customers, search, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

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
          Quản lý khách hàng
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý thông tin khách hàng
        </p>

        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredCustomers.length}
          totalCount={customers.length}
        />

        <DynamicTable
          data={paginatedCustomers}
          isLoading={isLoading}
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
              key: "address",
              title: "Địa chỉ",
              render: (row) => row.address || "-",
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
      </div>

      {/* FORM – CHỈ DÙNG ĐỂ EDIT */}
      <DynamicForm
        visible={showModal}
        title="Chỉnh sửa khách hàng"
        form={form}
        fields={[
          { name: "full_name", type: "text", label: "Họ tên", required: true },
          { name: "email", type: "text", label: "Email", readOnly: true },
          { name: "phone", type: "text", label: "Số điện thoại" },
          { name: "address", type: "text", label: "Địa chỉ" },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={updateMutation.isPending}
        onChange={handleChange}
        onSubmit={handleSubmitCustomer}
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
  );
};

export default AdminCustomersPage;
