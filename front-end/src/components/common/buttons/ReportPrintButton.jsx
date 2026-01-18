import React from 'react';
import { FaPrint, FaSpinner } from 'react-icons/fa';

const ReportPrintButton = ({ 
  summary = {},
  revenueData = { labels: [], values: [] },
  topCustomers = [],
  topServices = [],
  startDate,
  endDate,
  isLoading = false,
  onPrintStart,
  onPrintEnd,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false
}) => {
  const [isPrinting, setIsPrinting] = React.useState(false);

  // Helper function để format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Format date hiển thị
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Hàm tạo HTML cho báo cáo in
  const generateReportHTML = () => {
    // Tính toán thống kê
    const averageDailyRevenue = revenueData.values?.length > 0 
      ? (summary.totalRevenue || 0) / revenueData.values.length 
      : 0;
    
    const transitRate = summary.totalOrders > 0 
      ? ((summary.inTransit || 0) / summary.totalOrders) * 100 
      : 0;
    
    const ordersPerCustomer = summary.totalCustomers > 0 
      ? (summary.totalOrders || 0) / summary.totalCustomers 
      : 0;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Báo cáo GoShip - ${formatDateDisplay(startDate)} đến ${formatDateDisplay(endDate)}</title>
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
              color: #333;
            }
            
            .report-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px double #000;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
              text-transform: uppercase;
              color: #1e40af;
            }
            
            .header .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .header .date-range {
              font-size: 14px;
              color: #666;
              margin-top: 10px;
              font-weight: bold;
            }
            
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              background: #1e40af;
              color: white;
              padding: 10px 15px;
              margin-bottom: 15px;
              border-radius: 4px;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .stat-item {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            
            .stat-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
            }
            
            .table-container {
              margin-top: 10px;
              overflow-x: auto;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            
            th {
              background: #f1f5f9;
              font-weight: 600;
              text-align: left;
              padding: 10px;
              border: 1px solid #e2e8f0;
            }
            
            td {
              padding: 10px;
              border: 1px solid #e2e8f0;
            }
            
            .summary {
              background: #f0f9ff;
              border: 1px solid #bae6fd;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
            }
            
            .summary-title {
              font-size: 16px;
              font-weight: bold;
              color: #0369a1;
              margin-bottom: 10px;
            }
            
            .summary-content {
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px dashed #000;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            
            .company-info {
              margin-bottom: 20px;
              font-size: 14px;
              color: #333;
            }
            
            .company-name {
              font-size: 20px;
              font-weight: bold;
              color: #000;
              margin-bottom: 5px;
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 60px;
              color: rgba(0, 0, 0, 0.1);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
              white-space: nowrap;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .report-container {
                padding: 20px;
              }
              
              .watermark {
                display: block;
              }
              
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <!-- Watermark -->
            <div class="watermark">BÁO CÁO GOSHIP</div>
            
            <!-- Header -->
            <div class="header">
              <h1>BÁO CÁO HỆ THỐNG GOSHIP</h1>
              <div class="subtitle">Tổng quan và thống kê hệ thống</div>
              <div class="date-range">
                Khoảng thời gian: ${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 10px;">
                Ngày in: ${new Date().toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <!-- Thông tin công ty -->
            <div class="company-info">
              <div class="company-name">CÔNG TY VẬN CHUYỂN GoShip</div>
              <div>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</div>
              <div>Hotline: 1900-xxxx | Email: info@goship.vn | Website: www.goship.vn</div>
            </div>

            <!-- Thống kê tổng quan -->
            <div class="section">
              <div class="section-title">THỐNG KÊ TỔNG QUAN</div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">${summary.totalOrders || 0}</div>
                  <div class="stat-label">Tổng đơn hàng</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${summary.totalCustomers || 0}</div>
                  <div class="stat-label">Tổng khách hàng</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${summary.inTransit || 0}</div>
                  <div class="stat-label">Đang vận chuyển</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${formatCurrency(summary.totalRevenue || 0)}</div>
                  <div class="stat-label">Tổng doanh thu</div>
                </div>
              </div>
            </div>

            <!-- Doanh thu -->
            <div class="section">
              <div class="section-title">DOANH THU THEO THỜI GIAN</div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${revenueData.labels && revenueData.labels.length > 0 ? 
                      revenueData.labels.map((label, index) => `
                        <tr>
                          <td>${label}</td>
                          <td>${formatCurrency(revenueData.values[index] || 0)}</td>
                        </tr>
                      `).join('') : 
                      `<tr><td colspan="2" style="text-align: center;">Không có dữ liệu</td></tr>`
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Top khách hàng -->
            <div class="section">
              <div class="section-title">TOP 5 KHÁCH HÀNG</div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên khách hàng</th>
                      <th>Số đơn hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${topCustomers.length > 0 ? 
                      topCustomers.map((customer, index) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${customer.full_name || 'Không có tên'}</td>
                          <td>${customer.total_shipments || 0}</td>
                        </tr>
                      `).join('') : 
                      `<tr><td colspan="3" style="text-align: center;">Không có dữ liệu</td></tr>`
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Top dịch vụ -->
            <div class="section">
              <div class="section-title">TOP 5 DỊCH VỤ</div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên dịch vụ</th>
                      <th>Số lượt sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${topServices.length > 0 ? 
                      topServices.map((service, index) => `
                        <tr>
                          <td>${index + 1}</td>
                          <td>${service.service_name || 'Không có tên'}</td>
                          <td>${service.total_shipments || 0}</td>
                        </tr>
                      `).join('') : 
                      `<tr><td colspan="3" style="text-align: center;">Không có dữ liệu</td></tr>`
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Thông tin nhanh -->
            <div class="section">
              <div class="section-title">THÔNG TIN NHANH</div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">${formatCurrency(averageDailyRevenue)}</div>
                  <div class="stat-label">Doanh thu TB/ngày</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${transitRate.toFixed(1)}%</div>
                  <div class="stat-label">Tỷ lệ đơn đang giao</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${ordersPerCustomer.toFixed(1)}</div>
                  <div class="stat-label">Đơn hàng/Khách hàng</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${revenueData.labels?.length || 0}</div>
                  <div class="stat-label">Số ngày thống kê</div>
                </div>
              </div>
            </div>

            <!-- Tóm tắt -->
            <div class="summary">
              <div class="summary-title"> TÓM TẮT BÁO CÁO</div>
              <div class="summary-content">
                <p>Báo cáo này thể hiện hoạt động của hệ thống GoShip trong khoảng thời gian từ ${formatDateDisplay(startDate)} đến ${formatDateDisplay(endDate)}:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
                  <li>Tổng số đơn hàng: <strong>${summary.totalOrders || 0}</strong> đơn</li>
                  <li>Tổng doanh thu: <strong>${formatCurrency(summary.totalRevenue || 0)}</strong></li>
                  <li>Số khách hàng: <strong>${summary.totalCustomers || 0}</strong> khách</li>
                  <li>Số đơn đang vận chuyển: <strong>${summary.inTransit || 0}</strong> đơn</li>
                  <li>Doanh thu trung bình mỗi ngày: <strong>${formatCurrency(averageDailyRevenue)}</strong></li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div>Báo cáo này được tạo bởi hệ thống GoShip</div>
              <div>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</div>
              <div>Hotline: 1900-xxxx | Email: info@goship.vn</div>
              <div style="margin-top: 20px; font-size: 11px; color: #999;">
                Mã báo cáo: DASH-${Date.now()}<br/>
                Tổng số trang: 1
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

  // Xử lý in báo cáo
  const handlePrint = async () => {
    if (isLoading) {
      alert('Vui lòng đợi dữ liệu tải xong');
      return;
    }

    if (!summary || !revenueData) {
      alert('Không có dữ liệu để in báo cáo');
      return;
    }

    setIsPrinting(true);
    if (onPrintStart) onPrintStart();

    try {
      // Tạo cửa sổ in mới
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert('Vui lòng cho phép popup để in báo cáo');
        setIsPrinting(false);
        if (onPrintEnd) onPrintEnd();
        return;
      }

      // Tạo HTML cho báo cáo
      const printContent = generateReportHTML();
      
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
      alert('Lỗi khi in báo cáo: ' + error.message);
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
      outline: 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:scale-95',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg active:scale-95'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;
  };

  return (
    <button
      onClick={handlePrint}
      disabled={disabled || isPrinting || isLoading || !summary}
      className={getButtonClasses()}
      title="In báo cáo"
    >
      {isPrinting ? (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          <span>Đang in...</span>
        </>
      ) : (
        <>
          <FaPrint className="w-4 h-4" />
          <span>In báo cáo</span>
        </>
      )}
    </button>
  );
};

export default ReportPrintButton;