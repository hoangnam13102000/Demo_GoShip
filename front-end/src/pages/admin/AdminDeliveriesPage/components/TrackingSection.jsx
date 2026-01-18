import React, { useState } from "react";
import {
  FaTruck,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import TrackingSearch from "../../../../components/common/bars/TrackingSearch";
import TrackingResult from "../../../../pages/client/Tracking/TrackingResult";
import ReceiptPrintButton from "../../../../components/common/buttons/PrintReceiptButton";
import axios from "../../../../api/axios";

const TrackingSection = ({
  onStatusUpdate,
  onTransfer,
  isAdmin,
  isAgent,
  branches,
  currentCustomer,
}) => {
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

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

  const handleResultStatusUpdate = (shipment) => {
    if (onStatusUpdate) {
      onStatusUpdate(shipment);
    }
    setTrackingData(null);
  };

  const handleResultTransfer = (shipment) => {
    if (onTransfer) {
      onTransfer(shipment);
    }
    setTrackingData(null);
  };

  return (
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
              onStatusUpdate={handleResultStatusUpdate}
              onTransfer={handleResultTransfer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingSection;