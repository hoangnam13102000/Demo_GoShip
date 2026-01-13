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

/* ================= PAGE ================= */
const BranchShipmentsPage = () => {
  /* ================= USER INFO ================= */
  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserRole = currentUser?.role || "USER";
  const currentUserBranchId = currentUser?.branch_id;

  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("shipments");

  // Lấy thông tin agent hiện tại để lấy branch_id nếu là agent
  const { useGetAll: useGetAgents } = useCRUDApi("agents");
  const { data: agents = [] } = useGetAgents();
  
  // Tìm agent của user hiện tại
  const currentAgent = useMemo(() => {
    if (!currentUser?.id || currentUserRole !== 'AGENT') return null;
    return agents.find(agent => agent.account_id === currentUser.id);
  }, [agents, currentUser, currentUserRole]);

  const agentBranchId = currentAgent?.branch_id || currentUserBranchId;

  /* ================= SHIPMENTS DATA ================= */
  const { data: shipments = [], isLoading, isError } = useGetAll({ 
    staleTime: 1000 * 30,
    select: (data) => {
      // ADMIN xem tất cả shipments
      if (currentUserRole === 'ADMIN') {
        return data;
      }
      
      // AGENT chỉ xem shipments của chi nhánh mình
      if (currentUserRole === 'AGENT' && agentBranchId) {
        return data.filter(shipment => shipment.branch_id == agentBranchId);
      }
      
      // USER (khách hàng) chỉ xem shipments của mình
      if (currentUserRole === 'USER') {
        return data.filter(shipment => shipment.customer_id == currentUser?.id);
      }
      
      return [];
    }
  });

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
    // Tự động set branch_id nếu là agent
    const branchId = currentUserRole === 'AGENT' ? agentBranchId : "";
    
    setForm({
      ...initialForm,
      tracking_number: generateTrackingNumber(),
      branch_id: branchId,
      agent_id: currentUserRole === 'AGENT' ? currentAgent?.id : ""
    });
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (shipment) => {
    // Agent chỉ được edit shipments thuộc chi nhánh của mình
    if (currentUserRole === 'AGENT' && shipment.branch_id != agentBranchId) {
      setDialog({
        open: true,
        mode: "error",
        title: "Không có quyền",
        message: "Bạn chỉ được chỉnh sửa đơn hàng thuộc chi nhánh của bạn"
      });
      return;
    }

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
    // Agent chỉ được xem shipments thuộc chi nhánh của mình
    if (currentUserRole === 'AGENT' && shipment.branch_id != agentBranchId) {
      setDialog({
        open: true,
        mode: "error",
        title: "Không có quyền",
        message: "Bạn chỉ được xem đơn hàng thuộc chi nhánh của bạn"
      });
      return;
    }

    setViewItem(shipment);
  };

  const handleDeleteShipment = async (id) => {
    // Agent chỉ được delete shipments thuộc chi nhánh của mình
    if (currentUserRole === 'AGENT') {
      const shipment = shipments.find(s => s.id === id);
      if (shipment && shipment.branch_id != agentBranchId) {
        setDialog({
          open: true,
          mode: "error",
          title: "Không có quyền",
          message: "Bạn chỉ được xóa đơn hàng thuộc chi nhánh của bạn"
        });
        return;
      }
    }
    
    handleDelete(id);
  };

  /* ================= SUBMIT ================= */
  const handleSubmitShipment = (e) => {
    // Agent luôn phải set branch_id của mình
    const branchId = currentUserRole === 'AGENT' ? agentBranchId : form.branch_id;
    const agentId = currentUserRole === 'AGENT' ? currentAgent?.id : form.agent_id;

    if (currentUserRole === 'AGENT' && !branchId) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Agent phải có chi nhánh để tạo đơn hàng"
      });
      return;
    }

    const payload = {
      tracking_number: form.tracking_number,
      customer_id: Number(form.customer_id) || null,
      agent_id: agentId ? Number(agentId) : null,
      branch_id: Number(branchId),
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

  /* ================= PERMISSION CHECK ================= */
  // Kiểm tra quyền truy cập
  const canAccess = currentUserRole === 'ADMIN' || currentUserRole === 'AGENT';
  
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang quản lý vận chuyển.
          </p>
        </div>
      </div>
    );
  }

  // Agent không có branch_id thì không được tạo đơn
  const canCreate = currentUserRole === 'ADMIN' || 
                   (currentUserRole === 'AGENT' && agentBranchId);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER WITH BRANCH INFO */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý vận chuyển {currentUserRole === 'AGENT' ? 'chi nhánh' : ''}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600">
                {currentUserRole === 'AGENT' && agentBranchId && (
                  <>
                    <span>Chi nhánh:</span>
                    <span className="font-semibold text-blue-600">
                      {currentAgent?.branch?.name || `Chi nhánh #${agentBranchId}`}
                    </span>
                    <span className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      Nhân viên
                    </span>
                  </>
                )}
                {currentUserRole === 'ADMIN' && (
                  <span className="text-sm px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                    Quản trị viên
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                Đang hiển thị: <span className="font-bold">{filteredShipments.length}</span>/{shipments.length} đơn
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            {currentUserRole === 'ADMIN' 
              ? 'Quản lý toàn bộ đơn vận chuyển trong hệ thống'
              : `Quản lý đơn vận chuyển tại chi nhánh ${currentAgent?.branch?.name || 'của bạn'}`}
          </p>
        </div>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterType={filterType}
          setFilterType={handleFilterType}
          typeOptions={SHIPMENT_TYPE_OPTIONS}
          filteredCount={filteredShipments.length}
          totalCount={shipments.length}
        />

        {/* SHIPMENTS TABLE */}
        <DynamicTable
          data={paginatedShipments}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteShipment}
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
            // Hiển thị chi nhánh nếu là admin
            ...(currentUserRole === 'ADMIN' ? [{
              key: "branch",
              title: "Chi nhánh",
              render: (row) => row.branch?.name || `#${row.branch_id}`,
            }] : []),
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

        {/* CREATE BUTTON - chỉ hiển thị nếu có quyền */}
        {canCreate && (
          <CreateButton 
            label="Tạo đơn vận chuyển" 
            onClick={handleOpenCreate}
          />
        )}
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa đơn vận chuyển" : "Tạo đơn vận chuyển mới"}
        form={form}
        fields={[
          {
            name: "tracking_number",
            type: "text",
            label: "Mã vận đơn",
            required: true,
            readOnly: true,
          },
          {
            name: "sender_name",
            type: "text",
            label: "Tên người gửi",
            required: true,
          },
          {
            name: "sender_address",
            type: "text",
            label: "Địa chỉ người gửi",
            required: true,
          },
          {
            name: "sender_phone",
            type: "text",
            label: "Số điện thoại người gửi",
            required: false,
          },
          {
            name: "receiver_name",
            type: "text",
            label: "Tên người nhận",
            required: true,
          },
          {
            name: "receiver_address",
            type: "text",
            label: "Địa chỉ người nhận",
            required: true,
          },
          {
            name: "receiver_phone",
            type: "text",
            label: "Số điện thoại người nhận",
            required: false,
          },
          {
            name: "shipment_type",
            type: "select",
            label: "Loại vận chuyển",
            required: true,
            options: SHIPMENT_TYPE_OPTIONS.map(type => ({
              value: type,
              label: type === 'DOCUMENT' ? 'Tài liệu' : 
                     type === 'PACKAGE' ? 'Kiện hàng' : 'Express'
            }))
          },
          {
            name: "weight",
            type: "number",
            label: "Trọng lượng (kg)",
            required: true,
            step: "0.01"
          },
          {
            name: "charge",
            type: "number",
            label: "Phí vận chuyển (VND)",
            required: true,
          },
          {
            name: "expected_delivery_date",
            type: "date",
            label: "Ngày dự kiến giao",
            required: false,
          },
          ...(currentUserRole === 'ADMIN' ? [
            {
              name: "branch_id",
              type: "select",
              label: "Chi nhánh",
              required: true,
              options: [{ value: "", label: "Chọn chi nhánh" }]
            },
            {
              name: "customer_id",
              type: "number",
              label: "ID khách hàng",
              required: false,
            },
            {
              name: "agent_id",
              type: "number",
              label: "ID nhân viên",
              required: false,
            }
          ] : [])
        ]}
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
        userRole={currentUserRole}
        agentBranchId={agentBranchId}
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

export default BranchShipmentsPage;