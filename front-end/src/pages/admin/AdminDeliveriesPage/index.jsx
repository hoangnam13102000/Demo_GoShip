import React, { useState, useMemo } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTruck,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaExchangeAlt,
  FaWarehouse,
  FaBuilding,
  FaRoad,
  FaPlus,
  FaPrint,
} from "react-icons/fa";
import axios from "../../../api/axios";

import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useMutate } from "../../../api/hooks/useBaseQuery";
import StatCard from "../../../components/common/Cards/StatCard";
import FilterBar from "../../../components/common/FilterBar";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";
import PermissionGuard from "../../../components/auth/PermissionGuard";
import RoleBasedContent from "../../../components/auth/RoleBasedContent";
import usePermission from "../../../utils/auth/usePermission";
import useCurrentUser from "../../../utils/auth/useCurrentUser";
import ShipmentCard from "../../../components/common/Cards/ShipmentCard";
import TrackingSearch from "../../../components/common/bars/TrackingSearch";
import TrackingResult from "../../../pages/client/Tracking/TrackingResult";
import CreateShipmentPage from "../../../pages/client/CreateShipmentPage";
import ReceiptPrintButton from "../../../components/common/buttons/PrintReceiptButton";

const DeliveryManager = () => {
  /* ================= USER & PERMISSION ================= */
  const currentUser = useCurrentUser();
  const {
    role: currentUserRole,
    branchId: currentUserBranchId,
    isAdmin,
    isAgent,
    isUser,
  } = usePermission(currentUser);

  /* ================= API ================= */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("shipments");
  const { useGetAll: useGetAgents } = useCRUDApi("agents");
  const { useGetAll: useGetCustomers } = useCRUDApi("customers");
  const { useGetAll: useGetStatuses } = useCRUDApi("shipment-statuses");
  const { useGetAll: useGetBranches } = useCRUDApi("branches");

  const { data: agents = [] } = useGetAgents();
  const { data: customers = [] } = useGetCustomers();
  const { data: shipmentStatuses = [] } = useGetStatuses();
  const { data: branches = [] } = useGetBranches();

  /* ================= TRANSFER MUTATION ================= */
  const transferShipmentMutation = useMutate(
    "shipments",
    (data) => axios.post("/shipments/transfer", data),
    {
      onSuccess: () => {
        setSuccessMessage("Chuyển hàng thành công!");
        setTimeout(() => {
          setSuccessMessage("");
          refetch();
        }, 2000);
      },
      onError: (error) => {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message:
            error.response?.data?.message ||
            error.message ||
            "Chuyển hàng thất bại!",
        });
      },
    }
  );

  /* ================= AGENT ================= */
  const currentAgent = useMemo(() => {
    if (!currentUser?.id || currentUserRole !== "AGENT") {
      return null;
    }
    return agents.find((agent) => agent.account_id === currentUser.id) || null;
  }, [agents, currentUser, currentUserRole]);

  const agentBranchId = currentAgent?.branch_id || currentUserBranchId;

  /* ================= CUSTOMER ================= */
  const currentCustomer = useMemo(() => {
    if (currentUserRole !== "USER") {
      return null;
    }
    return (
      customers.find((customer) => customer.account_id === currentUser?.id) ||
      null
    );
  }, [customers, currentUser, currentUserRole]);

  const customerId = currentCustomer?.id;

  /* ================= SHIPMENTS ================= */
  const {
    data: shipments = [],
    isLoading,
    isError,
    refetch,
  } = useGetAll({
    staleTime: 1000 * 30,
    select: (data) => {
      if (isAdmin) {
        return data;
      }

      if (isAgent && agentBranchId) {
        return data.filter(
          (shipment) => shipment.current_branch_id === agentBranchId
        );
      }

      if (isUser) {
        if (!customerId) {
          return [];
        }
        return data.filter((shipment) => shipment.customer_id === customerId);
      }

      return [];
    },
  });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /* ================= STATE ================= */
  const [expandedId, setExpandedId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [transferToBranchId, setTransferToBranchId] = useState("");
  const [transferStatusId, setTransferStatusId] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "error",
    title: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [showCreateShipment, setShowCreateShipment] = useState(false);

  const itemsPerPage = 10;

  /* ================= STATUS CONFIG ================= */
  const statusColorMap = {
    PLACED: {
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: FaClock,
      borderColor: "border-yellow-500",
    },
    PICKED_UP: {
      color: "bg-blue-100",
      textColor: "text-blue-800",
      icon: FaBox,
      borderColor: "border-blue-500",
    },
    IN_TRANSIT: {
      color: "bg-blue-100",
      textColor: "text-blue-800",
      icon: FaTruck,
      borderColor: "border-blue-500",
    },
    DELIVERED: {
      color: "bg-green-100",
      textColor: "text-green-800",
      icon: FaCheckCircle,
      borderColor: "border-green-500",
    },
    CANCELLED: {
      color: "bg-red-100",
      textColor: "text-red-800",
      icon: FaExclamationCircle,
      borderColor: "border-red-500",
    },
  };

  const getStatusConfig = (statusId) => {
    const status = shipmentStatuses.find((item) => item.id === statusId);

    if (!status) {
      return null;
    }

    const colorConfig = statusColorMap[status.code] || {
      color: "bg-gray-100",
      textColor: "text-gray-800",
      icon: FaClock,
      borderColor: "border-gray-500",
    };

    return {
      ...colorConfig,
      label: status.name,
      id: status.id,
      code: status.code,
    };
  };

  /* ================= HANDLERS ================= */
  const handleStatusUpdate = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.current_status_id || "");
    setStatusNote("");
    setStatusModalOpen(true);
  };

  const handleTransferShipment = (shipment) => {
    setSelectedShipment(shipment);
    setTransferToBranchId("");
    setTransferStatusId(shipment.current_status_id || "");
    setTransferNote("");
    setTransferModalOpen(true);
  };

  const handleTrackingSearch = async (trackingNumber) => {
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingData(null);
    
    try {
      const res = await axios.get(`/shipments/track/${trackingNumber}`);
      setTrackingData(res.data);
    } catch (err) {
      console.error(err);
      setTrackingData(null);
      setTrackingError(err.response?.data?.message || "Không tìm thấy vận đơn");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleOpenCreateShipment = () => {
    setShowCreateShipment(true);
  };

  const handleCloseCreateShipment = () => {
    setShowCreateShipment(false);
    refetch();
  };

  const confirmStatusUpdate = async () => {
    if (!newStatus || !selectedShipment) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateMutation.mutateAsync({
        id: selectedShipment.id,
        data: {
          current_status_id: Number(newStatus),
          note: statusNote,
        },
      });

      setStatusModalOpen(false);
      setSelectedShipment(null);
      setSuccessMessage("Cập nhật trạng thái thành công!");

      setTimeout(() => {
        setSuccessMessage("");
        refetch();
      }, 2000);
    } catch (error) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: error.message || "Cập nhật trạng thái thất bại!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmTransferShipment = async () => {
    if (!transferToBranchId || !selectedShipment || !transferStatusId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await transferShipmentMutation.mutateAsync({
        shipment_id: selectedShipment.id,
        to_branch_id: Number(transferToBranchId),
        status_id: Number(transferStatusId),
        note: transferNote,
      });

      setTransferModalOpen(false);
      setSelectedShipment(null);
    } catch (error) {
      // Error handling is done in the mutation config
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (isAgent) {
      const shipment = shipments.find((item) => item.id === id);

      if (shipment && shipment.current_branch_id !== agentBranchId) {
        setDialog({
          open: true,
          mode: "error",
          title: "Không có quyền",
          message: "Bạn chỉ được xóa đơn hàng thuộc chi nhánh của bạn",
        });
        return;
      }
    }

    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          setDialog({ ...dialog, open: false });
          setSuccessMessage("Xóa đơn hàng thành công!");
          setTimeout(() => {
            setSuccessMessage("");
            refetch();
          }, 2000);
        } catch (error) {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: error.message || "Xóa đơn hàng thất bại!",
          });
        }
      },
    });
  };

  /* ================= FILTER ================= */
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch =
        shipment.tracking_number?.includes(searchTerm) ||
        shipment.sender_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shipment.receiver_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "ALL" ||
        shipment.current_status_id === Number(filterStatus);

      return matchesSearch && matchesFilter;
    });
  }, [shipments, searchTerm, filterStatus]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredShipments, currentPage]);

  /* ================= STATS ================= */
  const stats = {
    total: shipments.length,
    pending: shipments.filter((shipment) => {
      const status = shipmentStatuses.find(
        (item) => item.id === shipment.current_status_id
      );
      return status?.code === "PLACED";
    }).length,
    inTransit: shipments.filter((shipment) => {
      const status = shipmentStatuses.find(
        (item) => item.id === shipment.current_status_id
      );
      return status?.code === "IN_TRANSIT";
    }).length,
    delivered: shipments.filter((shipment) => {
      const status = shipmentStatuses.find(
        (item) => item.id === shipment.current_status_id
      );
      return status?.code === "DELIVERED";
    }).length,
  };

  /* ================= AVAILABLE BRANCHES FOR TRANSFER ================= */
  const availableBranchesForTransfer = useMemo(() => {
    if (!selectedShipment) return branches;

    return branches.filter(
      (branch) =>
        branch.id !== selectedShipment.current_branch_id &&
        branch.status === "ACTIVE"
    );
  }, [branches, selectedShipment]);

  /* ================= TRANSFER STATUSES ================= */
  const transferStatusOptions = useMemo(() => {
    return shipmentStatuses.filter((status) =>
      ["IN_TRANSIT", "PICKED_UP", "PROCESSING"].includes(status.code)
    );
  }, [shipmentStatuses]);

  /* ================= RENDER ================= */
  return (
    <PermissionGuard
      allowedRoles={["ADMIN", "AGENT", "USER"]}
      user={currentUser}
      customMessage="Bạn không có quyền truy cập trang quản lý vận chuyển."
    >
      {/* Nếu đang hiển thị form tạo đơn hàng */}
      {showCreateShipment ? (
        <CreateShipmentPage />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Success Message */}
          {successMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* Header */}
          <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <FaBox className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Quản Lý Giao Hàng
                    </h1>
                    <RoleBasedContent
                      user={currentUser}
                      renderByRole={{
                        AGENT: (
                          <p className="text-sm text-slate-500">
                            Chi nhánh:{" "}
                            {currentAgent?.branch?.name || "Chưa xác định"}
                          </p>
                        ),
                        USER: (
                          <p className="text-sm text-slate-500">
                            Khách hàng:{" "}
                            {currentCustomer?.name || currentUser?.email}
                          </p>
                        ),
                        ADMIN: (
                          <p className="text-sm text-slate-500">
                            Tất cả chi nhánh
                          </p>
                        ),
                      }}
                      defaultContent={
                        <p className="text-sm text-slate-500">Vận chuyển</p>
                      }
                    />
                  </div>
                </div>
                
                {/* Nút Thêm đơn hàng */}
                {(isAdmin || isAgent || isUser) && (
                  <button
                    onClick={handleOpenCreateShipment}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Thêm đơn hàng</span>
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Tracking Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaTruck className="w-5 h-5 text-blue-600" />
                Tra cứu vận đơn
              </h2>
              <TrackingSearch onSearch={handleTrackingSearch} />
              
              {/* Tracking Result */}
              <div className="mt-6">
                {trackingLoading && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-3">
                      <FaSpinner className="w-5 h-5 text-blue-600 animate-spin" />
                      <p className="text-slate-600 font-medium">Đang tìm kiếm vận đơn...</p>
                    </div>
                  </div>
                )}
                
                {trackingError && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <FaExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Không tìm thấy vận đơn</p>
                        <p className="text-sm text-red-600 mt-1">{trackingError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {trackingData && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">Kết quả tra cứu</h3>
                      {trackingData.shipment && (isAdmin || isAgent) && (
                        <ReceiptPrintButton
                          shipment={trackingData.shipment}
                          customerInfo={currentCustomer}
                          branches={branches}
                          variant="primary"
                          size="sm"
                          onPrintStart={() => console.log('Bắt đầu in biên nhận tra cứu...')}
                          onPrintEnd={() => console.log('In biên nhận tra cứu xong!')}
                        />
                      )}
                    </div>
                    <TrackingResult 
                      data={trackingData} 
                      compact={true}
                      showActions={isAdmin || isAgent}
                      onStatusUpdate={(shipment) => {
                        handleStatusUpdate(shipment);
                        setTrackingData(null);
                      }}
                      onTransfer={(shipment) => {
                        handleTransferShipment(shipment);
                        setTrackingData(null);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Tổng đơn hàng"
                value={stats.total}
                icon={FaBox}
                color="blue"
              />
              <StatCard
                title="Chờ xử lý"
                value={stats.pending}
                icon={FaClock}
                color="yellow"
              />
              <StatCard
                title="Đang giao"
                value={stats.inTransit}
                icon={FaTruck}
                color="blue"
              />
              <StatCard
                title="Đã giao"
                value={stats.delivered}
                icon={FaCheckCircle}
                color="green"
              />
            </div>
          </div>

          {/* Search & Filter */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <FilterBar
              search={searchTerm}
              setSearch={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              filterRole=""
              setFilterRole={() => {}}
              filterStatus={filterStatus}
              setFilterStatus={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
              roleOptions={[]}
              statusOptions={["Tất cả", ...shipmentStatuses.map((s) => s.name)]}
              filteredCount={filteredShipments.length}
              totalCount={shipments.length}
              customPlaceholder="Tìm theo mã vận đơn, người gửi, người nhận..."
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-center gap-3">
                <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-slate-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <FaExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-red-700">
                  Lỗi khi tải dữ liệu. Vui lòng thử lại!
                </p>
              </div>
            </div>
          )}

          {/* Shipments List */}
          {!isLoading && !isError && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {paginatedShipments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <FaBox className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                  <p className="text-slate-600">Không có đơn hàng nào</p>
                  {/* Nút thêm đơn hàng khi danh sách trống */}
                  {(isAdmin || isAgent || isUser) && (
                    <button
                      onClick={handleOpenCreateShipment}
                      className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg mx-auto"
                    >
                      <FaPlus className="w-5 h-5" />
                      <span>Tạo đơn hàng đầu tiên</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedShipments.map((shipment) => {
                    const statusConfig = getStatusConfig(
                      shipment.current_status_id
                    );
                    const isExpanded = expandedId === shipment.id;
                    const currentBranch = branches.find(
                      (b) => b.id === shipment.current_branch_id
                    );

                    return (
                      <div key={shipment.id} className="relative">
                        <ShipmentCard
                          shipment={shipment}
                          statusConfig={statusConfig}
                          isExpanded={isExpanded}
                          onToggleExpand={() =>
                            setExpandedId(isExpanded ? null : shipment.id)
                          }
                          currentBranch={currentBranch}
                          branches={branches}
                          showActions={isAdmin || isAgent}
                          onStatusUpdate={handleStatusUpdate}
                          onTransfer={handleTransferShipment}
                          onDelete={handleDelete}
                          // Thêm ReceiptPrintButton vào ShipmentCard
                          customActions={(isAdmin || isAgent) && (
                            <div className="flex items-center gap-2 ml-auto">
                              <ReceiptPrintButton
                                shipment={shipment}
                                customerInfo={currentCustomer}
                                branches={branches}
                                variant="outline"
                                size="sm"
                                onPrintStart={() => console.log(`Bắt đầu in đơn ${shipment.tracking_number}...`)}
                                onPrintEnd={() => console.log(`In đơn ${shipment.tracking_number} xong!`)}
                                className="shadow-sm"
                              />
                            </div>
                          )}
                        />
                        
                        {/* Fallback: Thêm nút in bên ngoài ShipmentCard nếu customActions không hoạt động */}
                        {(isAdmin || isAgent) && (
                          <div className="absolute top-4 right-4 z-10">
                            <ReceiptPrintButton
                              shipment={shipment}
                              customerInfo={currentCustomer}
                              branches={branches}
                              variant="outline"
                              size="sm"
                              onPrintStart={() => console.log(`Bắt đầu in đơn ${shipment.tracking_number}...`)}
                              onPrintEnd={() => console.log(`In đơn ${shipment.tracking_number} xong!`)}
                              className="shadow-md bg-white"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxVisible={5}
              />
            </div>
          )}

          {/* Status Update Modal */}
          {statusModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Cập nhật trạng thái
                  </h2>
                  <button
                    onClick={() => setStatusModalOpen(false)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Mã vận đơn:</p>
                  <p className="font-semibold text-slate-900">
                    {selectedShipment?.tracking_number}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">Người nhận:</p>
                  <p className="font-semibold text-slate-900">
                    {selectedShipment?.receiver_name}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaTruck className="w-4 h-4 text-blue-600" />
                    Trạng thái mới
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    {shipmentStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaEdit className="w-4 h-4 text-slate-600" />
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Nhập ghi chú về cập nhật..."
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStatusModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaTimes className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        Xác nhận
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Shipment Modal */}
          {transferModalOpen && selectedShipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Chuyển đơn hàng
                  </h2>
                  <button
                    onClick={() => setTransferModalOpen(false)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 bg-slate-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Mã vận đơn:</p>
                      <p className="font-semibold text-slate-900">
                        {selectedShipment.tracking_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Người nhận:</p>
                      <p className="font-semibold text-slate-900">
                        {selectedShipment.receiver_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200">
                    <FaWarehouse className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600">Chi nhánh hiện tại:</p>
                      <p className="font-semibold text-slate-900">
                        {branches.find(
                          (b) => b.id === selectedShipment.current_branch_id
                        )?.name || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-purple-600" />
                      Chuyển đến chi nhánh
                    </label>
                    <select
                      value={transferToBranchId}
                      onChange={(e) =>
                        setTransferToBranchId(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Chọn chi nhánh đích --</option>
                      {availableBranchesForTransfer.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} - {branch.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaRoad className="w-4 h-4 text-blue-600" />
                      Trạng thái chuyển hàng
                    </label>
                    <select
                      value={transferStatusId}
                      onChange={(e) => setTransferStatusId(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn trạng thái --</option>
                      {transferStatusOptions.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaEdit className="w-4 h-4 text-slate-600" />
                      Ghi chú chuyển hàng (tùy chọn)
                    </label>
                    <textarea
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      placeholder="Ví dụ: Chuyển hàng đến chi nhánh Hà Nội..."
                      rows="3"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setTransferModalOpen(false)}
                    disabled={isSubmitting || transferShipmentMutation.isLoading}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaTimes className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={confirmTransferShipment}
                    disabled={
                      isSubmitting ||
                      transferShipmentMutation.isLoading ||
                      !transferToBranchId ||
                      !transferStatusId
                    }
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {transferShipmentMutation.isLoading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaExchangeAlt className="w-4 h-4" />
                        Xác nhận chuyển
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Dialog */}
          <DynamicDialog
            open={dialog.open}
            mode={dialog.mode}
            title={dialog.title}
            message={dialog.message}
            onClose={() => setDialog({ ...dialog, open: false })}
            onConfirm={dialog.onConfirm}
            confirmText="Xóa"
            cancelText="Hủy"
            closeText="Đóng"
          />
        </div>
      )}
    </PermissionGuard>
  );
};

export default DeliveryManager;