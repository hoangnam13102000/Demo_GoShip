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
  FaClipboardCheck,
} from "react-icons/fa";

/* ================= CONSTANTS ================= */
// Mapping từ backend code sang frontend display (nếu cần)
const STATUS_MAPPING = {
  PLACED: {
    code: "PLACED",
    name: "Đã tạo đơn",
    className: "bg-yellow-100 text-yellow-800",
    dotColor: "bg-yellow-500",
  },
  PICKED_UP: {
    code: "PICKED_UP",
    name: "Đã lấy hàng",
    className: "bg-blue-100 text-blue-800",
    dotColor: "bg-blue-500",
  },
  IN_TRANSIT: {
    code: "IN_TRANSIT",
    name: "Đang vận chuyển",
    className: "bg-purple-100 text-purple-800",
    dotColor: "bg-purple-500",
  },
  DELIVERED: {
    code: "DELIVERED",
    name: "Đã giao hàng",
    className: "bg-green-100 text-green-800",
    dotColor: "bg-green-500",
  },
  CANCELLED: {
    code: "CANCELLED",
    name: "Đã huỷ",
    className: "bg-red-100 text-red-800",
    dotColor: "bg-red-500",
  },
};

const SERVICE_OPTIONS = [
  { code: "DOCUMENT", name: "Tài liệu" },
  { code: "PACKAGE", name: "Kiện hàng" },
  { code: "EXPRESS", name: "Express" },
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
  current_branch_id: "",
  agent_id: null,
  current_status_id: "", // Để trống, sẽ set dựa trên dữ liệu từ API
};

/* ================= HELPERS ================= */
const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN");
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
  const currentUserId = currentUser?.id;

  /* ================= API ================= */
  const {
    useGetAll: useGetShipments,
    useCreate,
    useUpdate,
    useDelete,
  } = useCRUDApi("shipments");
  const { useGetAll: useGetCustomers } = useCRUDApi("customers");
  const { useGetAll: useGetBranches } = useCRUDApi("branches");
  const { useGetAll: useGetServices } = useCRUDApi("shipment-services");
  const { useGetAll: useGetStatuses } = useCRUDApi("shipment-statuses");
  const { useGetAll: useGetAgents } = useCRUDApi("agents");

  // Lấy dữ liệu
  const {
    data: shipments = [],
    isLoading,
    isError,
    refetch,
  } = useGetShipments({
    select: (data) => {
      // ADMIN xem tất cả
      if (currentUserRole === "ADMIN") {
        return data;
      }

      // AGENT chỉ xem shipments của chi nhánh mình
      if (currentUserRole === "AGENT" && currentUserBranchId) {
        // Tìm agent dựa trên account_id
        const agentsData = agents.find(
          (agent) => agent.account_id === currentUserId
        );
        if (agentsData) {
          return data.filter(
            (shipment) => shipment.current_branch_id == agentsData.branch_id
          );
        }
        return [];
      }

      // USER chỉ xem shipments của mình
      if (currentUserRole === "USER" && currentUserId) {
        // Tìm customer dựa trên account_id
        const customer = customers.find((c) => c.account_id == currentUserId);
        if (customer) {
          return data.filter((shipment) => shipment.customer_id == customer.id);
        }
        return [];
      }

      return [];
    },
  });

  const { data: customers = [] } = useGetCustomers();
  const { data: branches = [] } = useGetBranches();
  const { data: services = [] } = useGetServices();
  const { data: statuses = [] } = useGetStatuses();
  const { data: agents = [] } = useGetAgents();

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
    onSuccess: () => refetch(),
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
    // Tìm status mặc định (PLACED)
    const defaultStatus = statuses.find((s) => s.code === "PLACED");
    
    // Tự động set các giá trị mặc định
    const defaultValues = {
      ...initialForm,
      // Nếu là AGENT, tự động set current_branch_id và agent_id
      ...(currentUserRole === "AGENT" && {
        current_branch_id: currentUserBranchId,
        agent_id:
          agents.find((a) => a.account_id === currentUserId)?.id || null,
      }),
      // Nếu là USER, tự động tìm customer_id
      ...(currentUserRole === "USER" && {
        customer_id:
          customers.find((c) => c.account_id == currentUserId)?.id || "",
      }),
      // Lấy status ID mặc định (PLACED từ backend)
      current_status_id: defaultStatus?.id || (statuses[0]?.id || ""),
    };

    setForm(defaultValues);
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
      expected_delivery_date:
        shipment.expected_delivery_date?.split("T")[0] || "",
      customer_id: shipment.customer_id || "",
      current_branch_id: shipment.current_branch_id || "",
      agent_id: shipment.agent_id || null,
      current_status_id: shipment.current_status_id || "",
    });
    setShowModal(true);
  };

  const handleViewDetails = (shipment) => {
    // Redirect đến trang chi tiết
    window.location.href = `/shipments/${shipment.id}`;
  };

  const handleTrackShipment = (shipmentId) => {
    // Mở tracking trong tab mới
    window.open(`/tracking/${shipmentId}`, "_blank");
  };

  const handleCreateTracking = (shipment) => {
    // Tạo tracking entry mới (chỉ ADMIN và AGENT)
    setDialog({
      open: true,
      mode: "form",
      title: "Cập nhật tracking đơn hàng",
      message: "",
      formFields: [
        {
          name: "status_id",
          type: "select",
          label: "Trạng thái mới",
          required: true,
          options: statuses.map((status) => ({
            value: status.id,
            label: status.name,
          })),
        },
        {
          name: "direction_flag",
          type: "select",
          label: "Hướng di chuyển",
          required: true,
          options: [
            { value: "IN", label: "Nhập kho chi nhánh" },
            { value: "OUT", label: "Xuất kho chi nhánh" },
          ],
        },
        {
          name: "note",
          type: "textarea",
          label: "Ghi chú",
          rows: 3,
        },
      ],
      initialForm: {
        shipment_id: shipment.id,
        status_id: shipment.current_status_id,
        from_branch_id: shipment.current_branch_id,
        to_branch_id: "", // Cần chọn
        updated_by: currentUserId,
        direction_flag: "IN",
        note: "",
      },
      onConfirm: async (formData) => {
        try {
          // Gọi API tạo tracking
          const response = await fetch("/api/tracking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) throw new Error("Lỗi khi tạo tracking");

          // Cập nhật trạng thái shipment
          await updateMutation.mutateAsync({
            id: shipment.id,
            data: {
              current_status_id: formData.status_id,
              ...(formData.to_branch_id && {
                current_branch_id: formData.to_branch_id,
              }),
            },
          });

          setDialog({ ...dialog, open: false });
          setSuccessMessage("Cập nhật tracking thành công!");
          refetch();
        } catch (error) {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: "Không thể cập nhật tracking: " + error.message,
          });
        }
      },
    });
  };

  const handleSubmitShipment = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "sender_name",
      "sender_phone",
      "sender_address",
      "sender_city",
      "receiver_name",
      "receiver_phone",
      "receiver_address",
      "receiver_city",
      "weight",
      "shipment_service_code",
      "charge",
      "customer_id",
      "current_branch_id",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message: `Vui lòng nhập ${field.replace("_", " ")}`,
        });
        return;
      }
    }

    const payload = {
      ...form,
      // CHUYỂN ĐỔI SANG NUMBER
      weight: parseFloat(form.weight),
      charge: parseFloat(form.charge),
    };

    // Chuyển agent_id thành null nếu là rỗng
    if (payload.agent_id === "") {
      payload.agent_id = null;
    }

    // Xóa các trường không cần thiết
    delete payload.status; // Nếu có

    // CHỈ gửi các trường đã thay đổi khi edit
    if (editing) {
      const changedFields = {};
      Object.keys(payload).forEach((key) => {
        // So sánh giá trị đã được chuyển đổi
        const originalValue = editing[key];
        const newValue = payload[key];

        // So sánh đặc biệt cho số
        if (key === "weight" || key === "charge") {
          if (parseFloat(originalValue) !== parseFloat(newValue)) {
            changedFields[key] = parseFloat(newValue);
          }
        } else if (originalValue !== newValue) {
          changedFields[key] = newValue;
        }
      });

      // Nếu không có thay đổi nào
      if (Object.keys(changedFields).length === 0) {
        setDialog({
          open: true,
          mode: "error",
          title: "Thông báo",
          message: "Không có thay đổi nào để cập nhật",
        });
        return;
      }

      console.log("Update payload:", changedFields);
      handleSubmit(e, editing, changedFields);
    } else {
      // Tạo mới: thêm tracking_number và set current_status_id
      payload.tracking_number = `GS${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`;
      
      // Đảm bảo có current_status_id (mặc định là PLACED)
      if (!payload.current_status_id) {
        const defaultStatus = statuses.find((s) => s.code === "PLACED");
        payload.current_status_id = defaultStatus?.id || (statuses[0]?.id || "");
      }
      
      console.log("Create payload:", payload);
      handleSubmit(e, editing, payload);
    }
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
          shipment.current_branch?.name,
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
        return shipment.current_branch_id == filterBranch;
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

  /* ================= STATUS CONFIG (sử dụng dữ liệu từ API) ================= */
  const getStatusOptions = () => {
    // Ưu tiên dùng dữ liệu từ API
    if (statuses.length > 0) {
      return statuses.map(status => ({
        value: status.code,
        label: status.name
      }));
    }
    
    // Fallback dùng mapping nếu API không có dữ liệu
    return Object.values(STATUS_MAPPING).map(status => ({
      value: status.code,
      label: status.name
    }));
  };

  const getStatusBadgeConfig = () => {
    const config = {};
    
    // Tạo config từ dữ liệu API kết hợp với mapping
    statuses.forEach(status => {
      const mappedStatus = STATUS_MAPPING[status.code];
      if (mappedStatus) {
        config[status.code] = {
          className: mappedStatus.className,
          dotColor: mappedStatus.dotColor,
          label: status.name, // Dùng name từ API
        };
      } else {
        // Nếu không có mapping, tạo config mặc định
        config[status.code] = {
          className: "bg-gray-100 text-gray-800",
          dotColor: "bg-gray-500",
          label: status.name,
        };
      }
    });
    
    return config;
  };

  const SERVICE_BADGE_CONFIG = {
    DOCUMENT: {
      className: "bg-blue-50 text-blue-700 border border-blue-200",
      label: "Tài liệu",
    },
    PACKAGE: {
      className: "bg-green-50 text-green-700 border border-green-200",
      label: "Kiện hàng",
    },
    EXPRESS: {
      className: "bg-red-50 text-red-700 border border-red-200",
      label: "Express",
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
            icon: <FaUser className="text-gray-400" />,
          },
          {
            name: "sender_phone",
            type: "text",
            label: "Số điện thoại",
            required: true,
            pattern: "[0-9]{10,11}",
            title: "Số điện thoại 10-11 số",
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
        ],
      },
      {
        section: "Thông tin người nhận",
        fields: [
          {
            name: "receiver_name",
            type: "text",
            label: "Họ tên",
            required: true,
            icon: <FaUser className="text-gray-400" />,
          },
          {
            name: "receiver_phone",
            type: "text",
            label: "Số điện thoại",
            required: true,
            pattern: "[0-9]{10,11}",
            title: "Số điện thoại 10-11 số",
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
        ],
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
            options: services.map((service) => ({
              value: service.code,
              label: service.name,
            })),
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
            icon: <FaCalendarAlt className="text-gray-400" />,
          },
        ],
      },
      {
        section: "Thông tin xử lý",
        fields: [],
      },
    ];

    // Thêm customer field cho tất cả (trừ USER không được sửa customer)
    if (currentUserRole !== "USER" || !editing) {
      baseFields[3].fields.push({
        name: "customer_id",
        type: "select",
        label: "Khách hàng",
        required: true,
        options: customers.map((customer) => ({
          value: customer.id,
          label: `${customer.full_name} - ${customer.phone}`,
        })),
      });
    }

    // Thêm branch field cho ADMIN và AGENT (AGENT chỉ xem branch của mình)
    if (currentUserRole === "ADMIN") {
      baseFields[3].fields.push({
        name: "current_branch_id",
        type: "select",
        label: "Chi nhánh xử lý",
        required: true,
        options: branches.map((branch) => ({
          value: branch.id,
          label: `${branch.name} - ${branch.city}`,
        })),
      });
    } else if (currentUserRole === "AGENT") {
      baseFields[3].fields.push({
        name: "current_branch_id",
        type: "text",
        label: "Chi nhánh xử lý",
        required: true,
        value: currentUserBranchId,
        disabled: true,
        helpText: "Tự động set theo chi nhánh của bạn",
      });
    } else {
      // USER không thấy branch field
      baseFields[3].fields.push({
        name: "current_branch_id",
        type: "hidden",
        value: branches[0]?.id || "", // Set mặc định branch đầu tiên
      });
    }

    // Thêm status field (chỉ ADMIN khi edit) - SỬ DỤNG DỮ LIỆU TỪ API
    if (currentUserRole === "ADMIN" && editing) {
      baseFields[3].fields.push({
        name: "current_status_id",
        type: "select",
        label: "Trạng thái hiện tại",
        required: true,
        options: statuses.map((status) => ({
          value: status.id,
          label: status.name,
        })),
      });
    }

    // Thêm agent field cho ADMIN
    if (currentUserRole === "ADMIN") {
      baseFields[3].fields.push({
        name: "agent_id",
        type: "select",
        label: "Nhân viên phụ trách",
        options: [
          { value: "", label: "Không chọn" },
          ...agents.map((agent) => ({
            value: agent.id,
            label: `${agent.full_name} - ${agent.phone}`,
          })),
        ],
      });
    }

    return baseFields;
  };

  /* ================= PERMISSION CHECK ================= */
  const canAccess = ["ADMIN", "AGENT", "USER"].includes(currentUserRole);
  const canCreate = ["ADMIN", "AGENT", "USER"].includes(currentUserRole);
  const canEdit = ["ADMIN", "AGENT"].includes(currentUserRole);
  const canUpdateTracking = ["ADMIN", "AGENT"].includes(currentUserRole);

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền xem danh sách lô hàng.
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  const statusBadgeConfig = getStatusBadgeConfig();
  const statusOptions = getStatusOptions();

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
                  Tổng số: <span className="font-bold">
                    {shipments.length}
                  </span>{" "}
                  lô hàng
                </span>
                {currentUserRole === "AGENT" && currentUserBranchId && (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Chi nhánh:{" "}
                    <span className="font-semibold">
                      {branches.find((b) => b.id == currentUserBranchId)
                        ?.name || currentUserBranchId}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="px-3 py-1 bg-gray-100 rounded-full">
                Đang hiển thị:{" "}
                <span className="font-bold">{filteredShipments.length}</span>/
                {shipments.length}
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
          statusOptions={["ALL", ...statusOptions.map(s => s.value)]} // Dùng dữ liệu từ API
          filteredCount={filteredShipments.length}
          totalCount={shipments.length}
          additionalFilters={[
            {
              label: "Dịch vụ",
              value: filterService,
              onChange: setFilterService,
              options: [
                { value: "ALL", label: "Tất cả dịch vụ" },
                ...SERVICE_OPTIONS.map((service) => ({
                  value: service.code,
                  label: service.name,
                })),
              ],
            },
            ...(currentUserRole === "ADMIN"
              ? [
                  {
                    label: "Chi nhánh",
                    value: filterBranch,
                    onChange: setFilterBranch,
                    options: [
                      { value: "ALL", label: "Tất cả chi nhánh" },
                      ...branches.map((branch) => ({
                        value: branch.id,
                        label: branch.name,
                      })),
                    ],
                  },
                ]
              : []),
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
              className: "text-blue-600 hover:text-blue-800",
            },
            {
              label: "Theo dõi",
              icon: <FaSearch />,
              onClick: (shipment) => handleTrackShipment(shipment.id),
              className: "text-green-600 hover:text-green-800",
            },
            ...(canUpdateTracking
              ? [
                  {
                    label: "Cập nhật tracking",
                    icon: <FaClipboardCheck />,
                    onClick: handleCreateTracking,
                    className: "text-purple-600 hover:text-purple-800",
                    condition: (shipment) =>
                      shipment.current_status?.code !== "DELIVERED",
                  },
                ]
              : []),
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
                <div
                  className="font-mono font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                  onClick={() => handleTrackShipment(row.id)}
                >
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
                  <div className="text-sm text-gray-500">
                    {row.sender_phone}
                  </div>
                  <div className="text-xs text-gray-400">{row.sender_city}</div>
                </div>
              ),
            },
            {
              key: "receiver",
              title: "Người nhận",
              render: (row) => (
                <div>
                  <div className="font-medium">{row.receiver_name}</div>
                  <div className="text-sm text-gray-500">
                    {row.receiver_phone}
                  </div>
                  <div className="text-xs text-gray-400">
                    {row.receiver_city}
                  </div>
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
                  value={row.current_status?.code || "PLACED"}
                  config={statusBadgeConfig}
                />
              ),
            },
            {
              key: "current_branch",
              title: "Chi nhánh hiện tại",
              render: (row) => (
                <div className="text-sm">
                  {row.current_branch ? (
                    <>
                      <div className="font-medium">
                        {row.current_branch.name}
                      </div>
                      <div className="text-gray-500">
                        {row.current_branch.city}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400">Chưa xác định</span>
                  )}
                </div>
              ),
            },
            {
              key: "agent",
              title: "Nhân viên phụ trách",
              render: (row) => (
                <div className="text-sm">
                  {row.agent ? (
                    <>
                      <div className="font-medium">{row.agent.full_name}</div>
                      <div className="text-gray-500">{row.agent.phone}</div>
                    </>
                  ) : (
                    <span className="text-gray-400">Chưa phân công</span>
                  )}
                </div>
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
        formFields={dialog.formFields}
        initialForm={dialog.initialForm}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={dialog.onConfirm}
        isSubmitting={dialog.isSubmitting}
      />
    </div>
  );
};

export default ShipmentsPage;