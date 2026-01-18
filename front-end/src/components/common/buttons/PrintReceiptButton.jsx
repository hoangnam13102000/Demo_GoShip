import React, { useRef } from 'react';
import { FaPrint, FaSpinner } from 'react-icons/fa';

const ReceiptPrintButton = ({ 
  shipment, 
  customerInfo,
  branches = [],
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPrintStart,
  onPrintEnd,
  logoUrl = '/images/Logo.png'
}) => {
  const [isPrinting, setIsPrinting] = React.useState(false);

  // Helper function để format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Helper function để format ngày giờ
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  // Format date không có giờ
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  // Lấy thông tin chi nhánh từ shipment hoặc branches prop
  const getBranchInfo = (branchId) => {
    if (!branchId) return null;
    
    // Tìm trong branches prop
    if (branches.length > 0) {
      return branches.find(b => b.id === branchId);
    }
    
    // Nếu shipment có thông tin branch
    if (shipment?.current_branch) {
      return shipment.current_branch;
    }
    
    return null;
  };

  // Lấy trạng thái hiện tại
  const getStatusText = () => {
    if (shipment?.current_status?.name) {
      return shipment.current_status.name;
    }
    if (shipment?.currentStatus?.name) {
      return shipment.currentStatus.name;
    }
    if (shipment?.current_status_id) {
      // Có thể gọi API để lấy tên status
    }
    return 'Chưa xác định';
  };

  // Lấy thông tin dịch vụ vận chuyển
  const getServiceInfo = () => {
    if (shipment?.service?.name) {
      return shipment.service.name;
    }
    return shipment?.shipment_service_code || 'N/A';
  };

  // Hàm tạo HTML cho biên nhận
  const generateReceiptHTML = () => {
    const currentBranch = getBranchInfo(shipment?.current_branch_id);
    const statusText = getStatusText();
    const serviceInfo = getServiceInfo();
    const currentDate = formatDateTime(new Date().toISOString());
    const createdDate = formatDate(shipment?.created_at);
    const expectedDelivery = formatDate(shipment?.expected_delivery_date) || 'Chưa xác định';
    const paymentMethod = shipment?.payment_method === 'CASH' ? 'Tiền mặt' : 
                         shipment?.payment_method === 'MOMO' ? 'MoMo' : 'Chưa thanh toán';
    
    // Tạo HTML cho lịch sử vận chuyển
    let trackingHistoryHTML = '';
    if (shipment?.trackingHistory && Array.isArray(shipment.trackingHistory) && shipment.trackingHistory.length > 0) {
      const trackingRows = shipment.trackingHistory.map((tracking, index) => {
        const time = formatDateTime(tracking.created_at);
        const status = tracking.status?.name || '';
        const location = tracking.toBranch?.name || '';
        return `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px;">${time}</td>
            <td style="padding: 8px;">${status}</td>
            <td style="padding: 8px;">${location}</td>
          </tr>
        `;
      }).join('');
      
      trackingHistoryHTML = `
        <div class="section">
          <div class="section-title">LỊCH SỬ VẬN CHUYỂN</div>
          <div style="padding: 10px; font-size: 13px; background: #f9f9f9; border-radius: 5px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #ddd;">
                  <th style="padding: 8px; text-align: left;">Thời gian</th>
                  <th style="padding: 8px; text-align: left;">Trạng thái</th>
                  <th style="padding: 8px; text-align: left;">Địa điểm</th>
                </tr>
              </thead>
              <tbody>
                ${trackingRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Biên nhận - ${shipment?.tracking_number || 'N/A'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              background: white;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border: 2px solid #000;
              padding: 30px;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px double #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            
            .company-logo {
              height: 80px;
              margin-bottom: 10px;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            
            .header .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .tracking-number {
              font-size: 20px;
              font-weight: bold;
              margin: 15px 0;
              padding: 10px;
              background: #f0f0f0;
              border-radius: 5px;
              text-align: center;
            }
            
            .section {
              margin-bottom: 20px;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              background: #333;
              color: white;
              padding: 8px 12px;
              margin-bottom: 10px;
              border-radius: 3px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 15px;
            }
            
            .info-item {
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            
            .info-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 3px;
              font-weight: 600;
            }
            
            .info-value {
              font-size: 14px;
              color: #000;
              font-weight: 500;
            }
            
            .full-width {
              grid-column: 1 / -1;
            }
            
            .price-summary {
              background: #f0f0f0;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
            
            .price-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #ccc;
            }
            
            .price-row:last-child {
              border-bottom: none;
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
              padding-top: 15px;
              border-top: 2px solid #333;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px dashed #000;
            }
            
            .signatures {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 50px;
              margin-top: 30px;
            }
            
            .signature-box {
              text-align: center;
            }
            
            .signature-label {
              font-weight: bold;
              margin-bottom: 60px;
            }
            
            .signature-line {
              border-top: 1px solid #000;
              padding-top: 5px;
              font-size: 12px;
              color: #666;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .receipt-container {
                border: none;
                padding: 20px;
              }
              
              @page {
                size: A4;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header với Logo -->
            <div class="header">
              <img 
                src="${logoUrl}" 
                alt="GoShip Logo" 
                class="company-logo"
                onerror="this.style.display='none';"
              />
              <h1>CÔNG TY VẬN CHUYỂN GoShip</h1>
              <div class="subtitle">Dịch vụ vận chuyển chuyên nghiệp</div>
              
              <div class="tracking-number">
                MÃ VẬN ĐƠN: ${shipment?.tracking_number || 'N/A'}
              </div>
              
              <div style="font-size: 12px; color: #666; margin-top: 10px;">
                Ngày in: ${currentDate}
              </div>
            </div>

            <!-- Thông tin chung -->
            <div class="section">
              <div class="section-title">THÔNG TIN CHUNG</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Trạng thái</div>
                  <div class="info-value">${statusText}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Chi nhánh hiện tại</div>
                  <div class="info-value">
                    ${currentBranch?.name || 'Chưa xác định'}
                    ${currentBranch?.city ? ' - ' + currentBranch.city : ''}
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Dịch vụ</div>
                  <div class="info-value">${serviceInfo}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Ngày tạo đơn</div>
                  <div class="info-value">${createdDate}</div>
                </div>
              </div>
            </div>

            <!-- Thông tin người gửi -->
            <div class="section">
              <div class="section-title">THÔNG TIN NGƯỜI GỬI</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Họ tên</div>
                  <div class="info-value">${shipment?.sender_name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Số điện thoại</div>
                  <div class="info-value">${shipment?.sender_phone || 'N/A'}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Địa chỉ</div>
                  <div class="info-value">
                    ${shipment?.sender_address || 'N/A'}
                    ${shipment?.sender_city ? ', ' + shipment.sender_city : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin người nhận -->
            <div class="section">
              <div class="section-title">THÔNG TIN NGƯỜI NHẬN</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Họ tên</div>
                  <div class="info-value">${shipment?.receiver_name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Số điện thoại</div>
                  <div class="info-value">${shipment?.receiver_phone || 'N/A'}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Địa chỉ</div>
                  <div class="info-value">
                    ${shipment?.receiver_address || 'N/A'}
                    ${shipment?.receiver_city ? ', ' + shipment.receiver_city : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin hàng hóa -->
            <div class="section">
              <div class="section-title">THÔNG TIN HÀNG HÓA</div>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Khối lượng (kg)</div>
                    <div class="info-value">${shipment?.weight || '0'} kg</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Ngày dự kiến giao</div>
                    <div class="info-value">
                      ${expectedDelivery}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Ghi chú</div>
                    <div class="info-value">
                      ${shipment?.description || shipment?.note || 'Không có ghi chú'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tổng chi phí -->
            <div class="price-summary">
              <div class="price-row">
                <span>Phí vận chuyển:</span>
                <span>${formatCurrency(shipment?.charge || 0)}</span>
              </div>
              <div class="price-row">
                <span>TỔNG CỘNG:</span>
                <span>${formatCurrency(shipment?.charge || 0)}</span>
              </div>
              <div class="price-row" style="font-size: 12px; color: #666; border-top: none; padding-top: 5px;">
                <span>Phương thức thanh toán:</span>
                <span>${paymentMethod}</span>
              </div>
            </div>

            <!-- Lịch sử vận chuyển -->
            ${trackingHistoryHTML}

            <!-- Thông tin công ty -->
            <div style="text-align: center; margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 5px; font-size: 14px; color: #333;">
              <div style="font-weight: bold; margin-bottom: 5px;">THÔNG TIN CÔNG TY</div>
              <div>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</div>
              <div>Hotline: 1900-xxxx | Email: info@goship.vn</div>
              <div>Website: www.goship.vn | MST: xxxxxxxxx</div>
            </div>

            <!-- Footer & Chữ ký -->
            <div class="footer">
              <div style="margin-top: 20px; font-size: 12px; color: #666; font-style: italic;">
                <strong>Lưu ý:</strong><br/>
                1. Quý khách vui lòng kiểm tra hàng hóa trước khi ký nhận<br/>
                2. Mọi khiếu nại sau khi ký nhận sẽ không được giải quyết<br/>
                3. Biên nhận này có giá trị như hóa đơn VAT<br/>
                4. Hotline hỗ trợ: 1900-xxxx (8:00 - 18:00, Thứ 2 - Thứ 7)
              </div>
              
              <div class="signatures">
                <div class="signature-box">
                  <div class="signature-label">NGƯỜI GỬI</div>
                  <div class="signature-line">Ký và ghi rõ họ tên</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">NGƯỜI GIAO HÀNG</div>
                  <div class="signature-line">Ký và ghi rõ họ tên</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">NGƯỜI NHẬN</div>
                  <div class="signature-line">Ký và ghi rõ họ tên</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">ĐẠI DIỆN CÔNG TY</div>
                  <div class="signature-line">Ký và ghi rõ họ tên</div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #666;">
                Biên nhận được in vào: ${currentDate}<br/>
                Mã in: ${shipment?.tracking_number || 'N/A'}-${Date.now()}
              </div>
            </div>
          </div>
          <script>
            // Tự động in sau khi trang load xong
            window.onload = function() {
              window.print();
              // Đóng cửa sổ sau khi in (cho phép delay để người dùng cancel)
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
  };

  // Xử lý in biên nhận
  const handlePrint = async () => {
    if (!shipment) {
      alert('Không có thông tin đơn hàng để in');
      return;
    }

    try {
      setIsPrinting(true);
      if (onPrintStart) onPrintStart();

      // Tạo window mới để in
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert('Vui lòng cho phép popup để in biên nhận');
        setIsPrinting(false);
        return;
      }

      // Tạo HTML content
      const printContent = generateReceiptHTML();

      // Write content và đợi load
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Đảm bảo window đã load xong
      printWindow.onload = function() {
        // Kích hoạt in
        printWindow.print();
        
        // Xử lý sau khi in
        printWindow.onafterprint = function() {
          printWindow.close();
          setIsPrinting(false);
          if (onPrintEnd) onPrintEnd();
        };

        // Fallback timeout
        setTimeout(() => {
          if (printWindow.closed) {
            setIsPrinting(false);
            if (onPrintEnd) onPrintEnd();
          } else {
            // Nếu user cancel in, đóng cửa sổ sau 3s
            setTimeout(() => {
              if (!printWindow.closed) {
                printWindow.close();
              }
              setIsPrinting(false);
              if (onPrintEnd) onPrintEnd();
            }, 3000);
          }
        }, 1000);
      };

      // Fallback nếu onload không trigger
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
            setIsPrinting(false);
            if (onPrintEnd) onPrintEnd();
          }, 1000);
        }
      }, 2000);

    } catch (error) {
      console.error('Print error:', error);
      alert('Lỗi khi in biên nhận: ' + error.message);
      setIsPrinting(false);
      if (onPrintEnd) onPrintEnd();
    }
  };

  // Xác định class dựa trên variant và size
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg active:scale-95',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-md hover:shadow-lg active:scale-95',
      outline: 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:scale-95'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;
  };

  return (
    <button
      onClick={handlePrint}
      disabled={disabled || isPrinting || !shipment}
      className={getButtonClasses()}
      title="In biên nhận"
    >
      {isPrinting ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Đang in...</span>
        </>
      ) : (
        <>
          <FaPrint className="w-4 h-4" />
          <span className="hidden sm:inline">In biên nhận</span>
          <span className="sm:hidden">In</span>
        </>
      )}
    </button>
  );
};

export default ReceiptPrintButton;