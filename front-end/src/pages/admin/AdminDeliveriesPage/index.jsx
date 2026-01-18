import React, { useState, useMemo } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import axios from "../../../api/axios";

import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import { useMutate } from "../../../api/hooks/useBaseQuery";
import FilterBar from "../../../components/common/FilterBar";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";
import PermissionGuard from "../../../components/auth/PermissionGuard";
import RoleBasedContent from "../../../components/auth/RoleBasedContent";
import usePermission from "../../../utils/auth/usePermission";
import useCurrentUser from "../../../utils/auth/useCurrentUser";
import ShipmentCard from "../../../components/common/Cards/ShipmentCard";
import CreateShipmentPage from "../../../pages/client/CreateShipmentPage";
import ReceiptPrintButton from "../../../components/common/buttons/PrintReceiptButton";
import StatusUpdateModal from "./components/StatusUpdateModal";
import TransferShipmentModal from "./components/TransferShipmentModal";
import ShipmentsStats from "./components/ShipmentsStats";
import TrackingSection from "./components/TrackingSection"; 
import { getStatusConfig } from "../../../config/shipmentConfig";

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
  const [showCreateShipment, setShowCreateShipment] = useState(false);

  const itemsPerPage = 10;

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
            <TrackingSection
              onStatusUpdate={handleStatusUpdate}
              onTransfer={handleTransferShipment}
              isAdmin={isAdmin}
              isAgent={isAgent}
              branches={branches}
              currentCustomer={currentCustomer}
            />
          </div>

          {/* Stats Component */}
          <ShipmentsStats stats={stats} />

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
                      shipment.current_status_id,
                      shipmentStatuses
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

          {/* Status Update Modal Component */}
          <StatusUpdateModal
            isOpen={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            selectedShipment={selectedShipment}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            statusNote={statusNote}
            setStatusNote={setStatusNote}
            shipmentStatuses={shipmentStatuses}
            isSubmitting={isSubmitting}
            onConfirm={confirmStatusUpdate}
          />

          {/* Transfer Shipment Modal Component */}
          <TransferShipmentModal
            isOpen={transferModalOpen}
            onClose={() => setTransferModalOpen(false)}
            selectedShipment={selectedShipment}
            transferToBranchId={transferToBranchId}
            setTransferToBranchId={setTransferToBranchId}
            transferStatusId={transferStatusId}
            setTransferStatusId={setTransferStatusId}
            transferNote={transferNote}
            setTransferNote={setTransferNote}
            availableBranchesForTransfer={availableBranchesForTransfer}
            transferStatusOptions={transferStatusOptions}
            branches={branches}
            shipmentStatuses={shipmentStatuses}
            isSubmitting={isSubmitting}
            isLoading={transferShipmentMutation.isLoading}
            onConfirm={confirmTransferShipment}
          />

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