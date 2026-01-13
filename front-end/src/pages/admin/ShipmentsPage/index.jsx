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
import { 
  FaBox, 
  FaTruck, 
  FaMapMarkerAlt, 
  FaUser, 
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaFileInvoiceDollar,
  FaClipboardCheck
} from "react-icons/fa";

/* ================= CONSTANTS ================= */
const STATUS_OPTIONS = [
  { code: "PENDING", name: "Chờ xử lý" },
  { code: "PICKUP", name: "Đang lấy hàng" },
  { code: "IN_TRANSIT", name: "Đang vận chuyển" },
  { code: "AT_BRANCH", name: "Tại chi nhánh" },
  { code: "OUT_FOR_DELIVERY", name: "Đang giao hàng" },
  { code: "DELIVERED", name: "Đã giao" },
  { code: "CANCELLED", name: "Đã hủy" },
  { code: "RETURNED", name: "Đã trả lại" }
];

const SERVICE_OPTIONS = [
  { code: "DOCUMENT", name: "Tài liệu" },
  { code: "PACKAGE", name: "Kiện hàng" },
  { code: "EXPRESS", name: "Express" }
];

/* ================= INITIAL FORM ================= */
const initialForm = {
  sender_name: "",
  sender_phone: "",
  sender_address: "",
  sender_city: "",
  receiver_name: "",
  receiver_phone: "",
  receiver_address: "",
  receiver_city: "",
  weight: "",
  shipment_service_code: "DOCUMENT",
  charge: "",
  expected_delivery_date: "",
  customer_id: "",
  branch_id: "",
};

/* ================= HELPERS ================= */
const formatCurrency = (num) => 
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

// Hàm lấy thông tin user từ localStorage
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("auth");
    
    if (userData) return JSON.parse(userData);
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
const ShipmentsPage = () => {
  /* ================= USER INFO ================= */
  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserRole = currentUser?.role || "USER";
  const currentUserBranchId = currentUser?.branch_id;

  /* ================= API ================= */
  const { useGetAll: useGetShipments, useCreate, useUpdate, useDelete } = useCRUDApi("shipments");
  const { useGetAll: useGetCustomers } = useCRUDApi("customers");
  const { useGetAll: useGetBranches } = useCRUDApi("branches");
  const { useGetAll: useGetServices } = useCRUDApi("shipment-services");
  const { useGetAll: useGetStatuses } = useCRUDApi("shipment-statuses");

  // Lấy dữ liệu
  const { data: shipments = [], isLoading, isError } = useGetShipments({
    select: (data) => {
      // ADMIN xem tất cả, AGENT chỉ xem shipments của chi nhánh mình
      if (currentUserRole === 'ADMIN') {
        return data;
      }
      if (currentUserRole === 'AGENT' && currentUserBranchId) {
        return data.filter(shipment => shipment.branch_id == currentUserBranchId);
      }
      if (currentUserRole === 'USER' && currentUser?.id) {
        return data.filter(shipment => shipment.customer?.account_id == currentUser.id);
      }
      return [];
    }
  });

  const { data: customers = [] } = useGetCustomers();
  const { data: branches = [] } = useGetBranches();
  const { data: services = [] } = useGetServices();
  const { data: statuses = [] } = useGetStatuses();

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /* ================= STATE ================= */
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterService, setFilterService] = useState("ALL");
  const [filterBranch, setFilterBranch] = useState("ALL");
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
    entityName: "lô hàng",
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
    // Tự động set branch_id cho AGENT
    const defaultBranchId = currentUserRole === 'AGENT' ? currentUserBranchId : "";
    
    setForm({
      ...initialForm,
      branch_id: defaultBranchId,
      customer_id: currentUserRole === 'USER' ? 
        customers.find(c => c.account_id === currentUser?.id)?.id || "" : ""
    });
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (shipment) => {
    setEditing(shipment);
    setForm({
      sender_name: shipment.sender_name || "",
      sender_phone: shipment.sender_phone || "",
      sender_address: shipment.sender_address || "",
      sender_city: shipment.sender_city || "",
      receiver_name: shipment.receiver_name || "",
      receiver_phone: shipment.receiver_phone || "",
      receiver_address: shipment.receiver_address || "",
      receiver_city: shipment.receiver_city || "",
      weight: shipment.weight || "",
      shipment_service_code: shipment.shipment_service_code || "DOCUMENT",
      charge: shipment.charge || "",
      expected_delivery_date: shipment.expected_delivery_date?.split('T')[0] || "",
      customer_id: shipment.customer_id || "",
      branch_id: shipment.branch_id || "",
    });
    setShowModal(true);
  };

  const handleViewDetails = (shipment) => {
    // Redirect đến trang chi tiết
    window.location.href = `/agent/shipments/${shipment.tracking_number}`;
  };

  const handleTrackShipment = (trackingNumber) => {
    // Mở tracking trong tab mới
    window.open(`/tracking/${trackingNumber}`, '_blank');
  };

  /* ================= SUBMIT ================= */
  const handleSubmitShipment = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      'sender_name', 'sender_phone', 'sender_address', 'sender_city',
      'receiver_name', 'receiver_phone', 'receiver_address', 'receiver_city',
      'weight', 'shipment_service_code', 'charge'
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message: `Vui lòng nhập ${field.replace('_', ' ')}`,
        });
        return;
      }
    }

    const payload = {
      ...form,
      weight: parseFloat(form.weight),
      charge: parseFloat(form.charge),
      // Tự động tạo tracking number nếu là tạo mới
      ...(!editing && { tracking_number: `GS${Date.now()}${Math.floor(Math.random() * 1000)}` })
    };

    handleSubmit(e, editing, payload);
  };

  /* ================= FILTER ================= */
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((shipment) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        const searchString = [
          shipment.tracking_number,
          shipment.sender_name,
          shipment.sender_phone,
          shipment.receiver_name,
          shipment.receiver_phone,
          shipment.customer?.full_name,
          shipment.agent?.full_name,
          shipment.branch?.name
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchString.includes(keyword);
      })
      .filter((shipment) => {
        if (filterStatus === "ALL") return true;
        return shipment.current_status?.code === filterStatus;
      })
      .filter((shipment) => {
        if (filterService === "ALL") return true;
        return shipment.shipment_service_code === filterService;
      })
      .filter((shipment) => {
        if (filterBranch === "ALL") return true;
        return shipment.branch_id == filterBranch;
      });
  }, [shipments, search, filterStatus, filterService, filterBranch]);

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

  /* ================= BADGE CONFIG ================= */
  const STATUS_BADGE_CONFIG = {
    PENDING: {
      className: "bg-yellow-100 text-yellow-800",
      dotColor: "bg-yellow-500",
      label: "Chờ xử lý"
    },
    PICKUP: {
      className: "bg-blue-100 text-blue-800",
      dotColor: "bg-blue-500",
      label: "Đang lấy hàng"
    },
    IN_TRANSIT: {
      className: "bg-purple-100 text-purple-800",
      dotColor: "bg-purple-500",
      label: "Đang vận chuyển"
    },
    AT_BRANCH: {
      className: "bg-indigo-100 text-indigo-800",
      dotColor: "bg-indigo-500",
      label: "Tại chi nhánh"
    },
    OUT_FOR_DELIVERY: {
      className: "bg-orange-100 text-orange-800",
      dotColor: "bg-orange-500",
      label: "Đang giao hàng"
    },
    DELIVERED: {
      className: "bg-green-100 text-green-800",
      dotColor: "bg-green-500",
      label: "Đã giao"
    },
    CANCELLED: {
      className: "bg-red-100 text-red-800",
      dotColor: "bg-red-500",
      label: "Đã hủy"
    },
    RETURNED: {
      className: "bg-gray-100 text-gray-800",
      dotColor: "bg-gray-500",
      label: "Đã trả lại"
    },
  };

  const SERVICE_BADGE_CONFIG = {
    DOCUMENT: {
      className: "bg-blue-50 text-blue-700 border border-blue-200",
      label: "Tài liệu"
    },
    PACKAGE: {
      className: "bg-green-50 text-green-700 border border-green-200",
      label: "Kiện hàng"
    },
    EXPRESS: {
      className: "bg-red-50 text-red-700 border border-red-200",
      label: "Express"
    },
  };

  /* ================= FORM FIELDS ================= */
  const getFormFields = () => {
    const baseFields = [
      {
        section: "Thông tin người gửi",
        fields: [
          {
            name: "sender_name",
            type: "text",
            label: "Họ tên",
            required: true,
            icon: <FaUser className="text-gray-400" />
          },
          {
            name: "sender_phone",
            type: "text",
            label: "Số điện thoại",
            required: true,
          },
          {
            name: "sender_address",
            type: "text",
            label: "Địa chỉ",
            required: true,
          },
          {
            name: "sender_city",
            type: "text",
            label: "Thành phố",
            required: true,
          },
        ]
      },
      {
        section: "Thông tin người nhận",
        fields: [
          {
            name: "receiver_name",
            type: "text",
            label: "Họ tên",
            required: true,
            icon: <FaUser className="text-gray-400" />
          },
          {
            name: "receiver_phone",
            type: "text",
            label: "Số điện thoại",
            required: true,
          },
          {
            name: "receiver_address",
            type: "text",
            label: "Địa chỉ",
            required: true,
          },
          {
            name: "receiver_city",
            type: "text",
            label: "Thành phố",
            required: true,
          },
        ]
      },
      {
        section: "Thông tin lô hàng",
        fields: [
          {
            name: "weight",
            type: "number",
            label: "Trọng lượng (kg)",
            required: true,
            min: 0.1,
            step: 0.1,
          },
          {
            name: "shipment_service_code",
            type: "select",
            label: "Dịch vụ",
            required: true,
            options: services.map(service => ({
              value: service.code,
              label: service.name
            }))
          },
          {
            name: "charge",
            type: "number",
            label: "Phí vận chuyển (VNĐ)",
            required: true,
            min: 0,
          },
          {
            name: "expected_delivery_date",
            type: "date",
            label: "Ngày giao dự kiến",
            icon: <FaCalendarAlt className="text-gray-400" />
          },
        ]
      }
    ];

    // Thêm customer field cho ADMIN/AGENT
    if (currentUserRole === 'ADMIN' || currentUserRole === 'AGENT') {
      baseFields[0].fields.push({
        name: "customer_id",
        type: "select",
        label: "Khách hàng",
        required: true,
        options: customers.map(customer => ({
          value: customer.id,
          label: `${customer.full_name} - ${customer.phone}`
        }))
      });
    }

    // Thêm branch field cho ADMIN
    if (currentUserRole === 'ADMIN') {
      baseFields[2].fields.push({
        name: "branch_id",
        type: "select",
        label: "Chi nhánh xử lý",
        required: true,
        options: branches.map(branch => ({
          value: branch.id,
          label: `${branch.name} - ${branch.city}`
        }))
      });
    }

    return baseFields;
  };

  /* ================= PERMISSION CHECK ================= */
  const canAccess = ['ADMIN', 'AGENT', 'USER'].includes(currentUserRole);
  const canCreate = ['ADMIN', 'AGENT', 'USER'].includes(currentUserRole);
  const canEdit = ['ADMIN', 'AGENT'].includes(currentUserRole);

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền xem danh sách lô hàng.
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaBox className="text-blue-600" />
                Danh sách lô hàng
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <FaTruck className="text-green-600" />
                  Tổng số: <span className="font-bold">{shipments.length}</span> lô hàng
                </span>
                {currentUserRole === 'AGENT' && currentUserBranchId && (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Chi nhánh: <span className="font-semibold">{branches.find(b => b.id == currentUserBranchId)?.name || currentUserBranchId}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                Đang hiển thị: <span className="font-bold">{filteredShipments.length}</span>/{shipments.length}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi tất cả lô hàng trong hệ thống
          </p>
        </div>

        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusOptions={STATUS_OPTIONS.map(s => s.code)}
          filteredCount={filteredShipments.length}
          totalCount={shipments.length}
          additionalFilters={[
            {
              label: "Dịch vụ",
              value: filterService,
              onChange: setFilterService,
              options: [
                { value: "ALL", label: "Tất cả dịch vụ" },
                ...SERVICE_OPTIONS.map(service => ({
                  value: service.code,
                  label: service.name
                }))
              ]
            },
            ...(currentUserRole === 'ADMIN' ? [{
              label: "Chi nhánh",
              value: filterBranch,
              onChange: setFilterBranch,
              options: [
                { value: "ALL", label: "Tất cả chi nhánh" },
                ...branches.map(branch => ({
                  value: branch.id,
                  label: branch.name
                }))
              ]
            }] : [])
          ]}
        />

        {/* SHIPMENTS TABLE */}
        <DynamicTable
          data={paginatedShipments}
          isLoading={isLoading}
          isError={isError}
          onEdit={canEdit ? handleEdit : null}
          onDelete={canEdit ? handleDelete : null}
          additionalActions={[
            {
              label: "Xem chi tiết",
              icon: <FaEye />,
              onClick: handleViewDetails,
              className: "text-blue-600 hover:text-blue-800"
            },
            {
              label: "Theo dõi",
              icon: <FaSearch />,
              onClick: (shipment) => handleTrackShipment(shipment.tracking_number),
              className: "text-green-600 hover:text-green-800"
            }
          ]}
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
                <div className="font-mono font-bold text-blue-700">
                  {row.tracking_number}
                </div>
              ),
            },
            {
              key: "sender",
              title: "Người gửi",
              render: (row) => (
                <div>
                  <div className="font-medium">{row.sender_name}</div>
                  <div className="text-sm text-gray-500">{row.sender_phone}</div>
                </div>
              ),
            },
            {
              key: "receiver",
              title: "Người nhận",
              render: (row) => (
                <div>
                  <div className="font-medium">{row.receiver_name}</div>
                  <div className="text-sm text-gray-500">{row.receiver_phone}</div>
                </div>
              ),
            },
            {
              key: "service",
              title: "Dịch vụ",
              render: (row) => (
                <GenericBadge
                  value={row.shipment_service_code}
                  config={SERVICE_BADGE_CONFIG}
                />
              ),
            },
            {
              key: "status",
              title: "Trạng thái",
              render: (row) => (
                <GenericBadge
                  value={row.current_status?.code || "PENDING"}
                  config={STATUS_BADGE_CONFIG}
                />
              ),
            },
            {
              key: "charge",
              title: "Phí vận chuyển",
              render: (row) => formatCurrency(row.charge),
            },
            {
              key: "created_at",
              title: "Ngày tạo",
              render: (row) => formatDate(row.created_at),
            },
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

        {/* CREATE BUTTON */}
        {canCreate && (
          <CreateButton 
            label="Tạo lô hàng mới" 
            onClick={handleOpenCreate}
            icon={<FaBox />}
          />
        )}
      </div>

      {/* FORM MODAL */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa lô hàng" : "Tạo lô hàng mới"}
        form={form}
        sections={getFormFields()}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onChange={handleChange}
        onSubmit={handleSubmitShipment}
        onCancel={resetForm}
      />

      {/* CONFIRM DIALOG */}
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

export default ShipmentsPage;