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
import ShipmentDetailDialog from "./ShipmentDetailDialog";

/* ================= CONSTANTS ================= */

const SHIPMENT_TYPE_OPTIONS = ["DOCUMENT", "PACKAGE", "EXPRESS"];

/* ================= INITIAL FORM ================= */

const initialForm = {
  tracking_number: "",
  customer_id: "",
  agent_id: "",
  branch_id: "",
  sender_name: "",
  sender_address: "",
  sender_phone: "",
  receiver_name: "",
  receiver_address: "",
  receiver_phone: "",
  shipment_type: "PACKAGE",
  weight: "",
  charge: "",
  expected_delivery_date: "",
};

/* ================= HELPERS ================= */

const generateTrackingNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SHP${timestamp}${random}`;
};

/* ================= PAGE ================= */

const AdminShipmentsPage = () => {
  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("shipments");

  const {
    data: shipments = [],
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
  const [filterType, setFilterType] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);
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
    entityName: "đơn vận chuyển",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCreate = () => {
    setForm({
      ...initialForm,
      tracking_number: generateTrackingNumber(),
    });
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (shipment) => {
    setEditing(shipment);
    setForm({
      tracking_number: shipment.tracking_number || "",
      customer_id: shipment.customer_id || "",
      agent_id: shipment.agent_id || "",
      branch_id: shipment.branch_id || "",
      sender_name: shipment.sender_name || "",
      sender_address: shipment.sender_address || "",
      sender_phone: shipment.sender_phone || "",
      receiver_name: shipment.receiver_name || "",
      receiver_address: shipment.receiver_address || "",
      receiver_phone: shipment.receiver_phone || "",
      shipment_type: shipment.shipment_type || "PACKAGE",
      weight: shipment.weight ?? "",
      charge: shipment.charge ?? "",
      expected_delivery_date: shipment.expected_delivery_date || "",
    });
    setShowModal(true);
  };

  const handleView = (shipment) => {
    setViewItem(shipment);
  };

  /* ================= SUBMIT ================= */
  const handleSubmitShipment = (e) => {
    const payload = {
      tracking_number: form.tracking_number,
      customer_id: Number(form.customer_id),
      agent_id: form.agent_id ? Number(form.agent_id) : null,
      branch_id: Number(form.branch_id),
      sender_name: form.sender_name,
      sender_address: form.sender_address,
      sender_phone: form.sender_phone || null,
      receiver_name: form.receiver_name,
      receiver_address: form.receiver_address,
      receiver_phone: form.receiver_phone || null,
      shipment_type: form.shipment_type,
      weight: Number(form.weight),
      charge: Number(form.charge),
      expected_delivery_date: form.expected_delivery_date || null,
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((s) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        return (
          s.tracking_number?.toLowerCase().includes(keyword) ||
          s.sender_name?.toLowerCase().includes(keyword) ||
          s.receiver_name?.toLowerCase().includes(keyword) ||
          s.sender_phone?.toLowerCase().includes(keyword) ||
          s.receiver_phone?.toLowerCase().includes(keyword)
        );
      })
      .filter((s) =>
        filterType === "ALL" ? true : s.shipment_type === filterType
      );
  }, [shipments, search, filterType]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredShipments, currentPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterType = (value) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  /* ================= BADGE CONFIG ================= */
  const SHIPMENT_TYPE_BADGE_CONFIG = {
    DOCUMENT: { className: "bg-blue-100 text-blue-700" },
    PACKAGE: { className: "bg-gray-100 text-gray-700" },
    EXPRESS: { className: "bg-red-100 text-red-700" },
    DEFAULT: { className: "bg-gray-100 text-gray-700" },
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý đơn vận chuyển
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý toàn bộ đơn vận chuyển trong hệ thống
        </p>

        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterType={filterType}
          setFilterType={handleFilterType}
          typeOptions={SHIPMENT_TYPE_OPTIONS}
          filteredCount={filteredShipments.length}
          totalCount={shipments.length}
        />

        <DynamicTable
          data={paginatedShipments}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onView={handleView}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) => (currentPage - 1) * itemsPerPage + i + 1,
            },
            {
              key: "tracking_number",
              title: "Mã vận đơn",
              render: (row) => (
                <span className="font-mono font-semibold text-blue-600">
                  {row.tracking_number}
                </span>
              ),
            },
            {
              key: "sender_name",
              title: "Người gửi",
              render: (row) => row.sender_name || "-",
            },
            {
              key: "receiver_name",
              title: "Người nhận",
              render: (row) => row.receiver_name || "-",
            },
            {
              key: "shipment_type",
              title: "Loại",
              render: (row) => (
                <GenericBadge
                  value={row.shipment_type}
                  config={SHIPMENT_TYPE_BADGE_CONFIG}
                />
              ),
            },
            {
              key: "weight",
              title: "Trọng lượng",
              render: (row) => `${row.weight} kg`,
            },
            {
              key: "charge",
              title: "Phí vận chuyển",
              render: (row) =>
                Number(row.charge).toLocaleString("vi-VN") + "đ",
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <CreateButton label="Tạo đơn vận chuyển" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa đơn vận chuyển" : "Tạo đơn vận chuyển mới"}
        form={form}
        fields={[/* giữ nguyên như bạn đã có */]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={handleSubmitShipment}
        onCancel={resetForm}
      />

      {/* VIEW DETAIL */}
      <ShipmentDetailDialog
        open={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
        onEdit={handleEdit}
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

export default AdminShipmentsPage;
