import { useState, useMemo } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
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
  code: "",
  name: "",
  description: "",
  base_price: "",
  max_weight: "",
  estimated_delivery_time: "",
  features: "",
  is_featured: false,
  is_active: true,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1";
const toBit = (v) => (toBool(v) ? 1 : 0);

const parseFeatures = (val) => {
  if (!val) return null;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
};

/* ================= PAGE ================= */

const AdminShipmentServicesPage = () => {
  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("shipment-services");

  const {
    data: services = [],
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
    entityName: "dịch vụ",
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

  const handleEdit = (service) => {
    setEditing(service);
    setForm({
      code: service.code || "",
      name: service.name || "",
      description: service.description || "",
      base_price: service.base_price ?? "",
      max_weight: service.max_weight ?? "",
      estimated_delivery_time: service.estimated_delivery_time || "",
      features: service.features ? JSON.stringify(service.features) : "",
      is_featured: toBool(service.is_featured),
      is_active: toBool(service.is_active),
    });
    setShowModal(true);
  };

  /* ================= SUBMIT (QUAN TRỌNG) ================= */

  const handleSubmitService = (e) => {
    const payload = {
      ...form,
      base_price: Number(form.base_price),
      max_weight: form.max_weight ? Number(form.max_weight) : null,
      features: parseFeatures(form.features),
      is_featured: toBit(form.is_featured),
      is_active: toBit(form.is_active),
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        if (!search.trim()) return true;
        const k = search.toLowerCase();
        return (
          s.name?.toLowerCase().includes(k) || s.code?.toLowerCase().includes(k)
        );
      })
      .filter((s) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(s.is_active)
          : !toBool(s.is_active);
      });
  }, [services, search, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, currentPage]);

  // Reset về trang 1 khi search/filter thay đổi
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  /* ================= BADGE ================= */

  const STATUS_BADGE_CONFIG = {
    ACTIVE: { className: "bg-green-100 text-green-700" },
    INACTIVE: { className: "bg-red-100 text-red-700" },
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý dịch vụ vận chuyển
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý toàn bộ dịch vụ vận chuyển
        </p>

        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredServices.length}
          totalCount={services.length}
        />

        <DynamicTable
          data={paginatedServices}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={(row) => handleDelete(row, row.name)}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) => (currentPage - 1) * itemsPerPage + i + 1,
            },
            { key: "code", title: "Mã", render: (r) => r.code },
            { key: "name", title: "Tên", render: (r) => r.name },
            {
              key: "base_price",
              title: "Giá",
              render: (r) =>
                r.base_price
                  ? Number(r.base_price).toLocaleString("vi-VN") + "đ"
                  : "-",
            },
            {
              key: "is_featured",
              title: "Nổi bật",
              render: (r) =>
                toBool(r.is_featured) ? (
                  <FaStar className="text-yellow-500" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                ),
            },
            {
              key: "is_active",
              title: "Trạng thái",
              render: (r) => (
                <GenericBadge
                  value={toBool(r.is_active) ? "ACTIVE" : "INACTIVE"}
                  config={STATUS_BADGE_CONFIG}
                />
              ),
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <CreateButton label="Thêm dịch vụ" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
        form={form}
        fields={[
          {
            name: "code",
            label: "Mã dịch vụ",
            type: "text",
            readOnly: editing ? true : false,
          },
          {
            name: "name",
            label: "Tên dịch vụ",
            type: "text",
          },
          {
            name: "description",
            label: "Mô tả",
            type: "textarea",
          },
          {
            name: "base_price",
            label: "Giá cơ bản",
            type: "number",
          },
          {
            name: "max_weight",
            label: "Khối lượng tối đa (kg)",
            type: "number",
          },
          {
            name: "estimated_delivery_time",
            label: "Thời gian giao hàng dự kiến",
            type: "text",
            placeholder: "Ví dụ: 1-2 ngày",
          },
          {
            name: "features",
            label: "Tính năng",
            type: "textarea",
            placeholder: '["Giao nhanh","Bảo hiểm"]',
          },
          {
            name: "is_featured",
            label: "Dịch vụ nổi bật",
            type: "checkbox",
          },
          {
            name: "is_active",
            label: "Đang hoạt động",
            type: "checkbox",
          },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onChange={handleChange}
        onSubmit={handleSubmitService}
        onCancel={resetForm}
      />

      {/* DIALOG */}
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

export default AdminShipmentServicesPage;