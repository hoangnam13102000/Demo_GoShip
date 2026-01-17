import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCommentDots,
  FaPhone,
  FaTag,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaHeadset,
  FaBuilding,
  FaPaperPlane,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import useCurrentUser from "../../../utils/auth/useCurrentUser";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const API = import.meta.env.VITE_API_URL;

const ContactPage = () => {
  const currentUser = useCurrentUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "HỖ TRỢ",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ===== DIALOG STATE ===== */
  const [dialog, setDialog] = useState({
    open: false,
    mode: "success",
    title: "",
    message: "",
  });

  /* =============================
   * AUTO FILL USER INFO
   * ============================= */
  useEffect(() => {
    if (!currentUser) return;

    setForm((prev) => ({
      ...prev,
      name: currentUser.name || prev.name,
      email: currentUser.email || prev.email,
    }));
  }, [currentUser]);

  /* =============================
   * HANDLE CHANGE
   * ============================= */
  const handleChange = (field) => (value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =============================
   * SUBMIT CONTACT
   * ============================= */
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gửi liên hệ thất bại");
      }

      /* SUCCESS DIALOG */
      setDialog({
        open: true,
        mode: "success",
        title: "Gửi thành công! 🎉",
        message: "Chúng tôi đã nhận được liên hệ và sẽ phản hồi trong vòng 24 giờ.",
      });

      setIsSubmitted(true);
      
      setForm({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: "",
        subject: "",
        type: "HỖ TRỢ",
        message: "",
      });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      /* ERROR DIALOG */
      setDialog({
        open: true,
        mode: "error",
        title: "Gửi thất bại",
        message: err.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =============================
   * CONTACT INFO CARDS DATA
   * ============================= */
  const contactInfo = [
    {
      icon: <FaBuilding className="text-2xl" />,
      title: "Trụ sở chính",
      details: ["Tòa nhà GoShip Tower", "123 Nguyễn Văn Linh", "Quận 7, TP.HCM"],
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: <FaPhoneAlt className="text-2xl" />,
      title: "Điện thoại",
      details: ["(+84) 28 1234 5678", "Hotline: 1800 1234"],
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7: 8:00 - 12:00", "Chủ nhật: Nghỉ"],
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "Hỗ trợ nhanh",
      details: ["Email: support@goship.vn", "Zalo: 0901 234 567"],
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <>
      {/* ===== DIALOG ===== */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={() =>
          setDialog((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      {/* ===== MAIN CONTENT ===== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-6">
            <MdSupportAgent className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Kết nối với GoShip
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. 
            Mọi thắc mắc và góp ý sẽ được phản hồi trong thời gian sớm nhất.
          </p>
        </div>

        {/* Success Banner - Đã được thay thế bằng Dialog */}
        {false && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 flex items-center gap-4 animate-fade-in">
              <FaCheckCircle className="text-3xl text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800 text-lg">Cảm ơn bạn đã liên hệ!</h3>
                <p className="text-green-700">
                  Chúng tôi đã nhận được tin nhắn của bạn và sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`${info.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-white mb-4`}>
                  <div className={info.iconColor}>{info.icon}</div>
                </div>
                <h3 className="font-bold text-gray-800 mb-3">{info.title}</h3>
                <ul className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaPaperPlane className="text-xl" />
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="text-blue-100 mt-2">
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay
                </p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="Họ và tên"
                      icon={FaUser}
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Nguyễn Văn A"
                      disabled={!!currentUser}
                      className="bg-gray-50"
                    />
                    <InputField
                      label="Email"
                      icon={FaEnvelope}
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="example@email.com"
                      disabled={!!currentUser}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField
                      label="Số điện thoại"
                      icon={FaPhone}
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="0123 456 789"
                      className="bg-gray-50"
                    />
                    <InputField
                      label="Tiêu đề"
                      icon={FaTag}
                      value={form.subject}
                      onChange={handleChange("subject")}
                      placeholder="Vấn đề cần hỗ trợ"
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Type Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
                      Loại liên hệ
                    </label>
                    <div className="relative">
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 pl-12 
                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                                 appearance-none cursor-pointer transition-all"
                      >
                        <option value="HỖ TRỢ">Hỗ trợ kỹ thuật</option>
                        <option value="KHIẾU NẠI">Khiếu nại dịch vụ</option>
                        <option value="GÓP Ý">Góp ý cải tiến</option>
                        <option value="HỢP TÁC">Hợp tác kinh doanh</option>
                        <option value="KHÁC">Vấn đề khác</option>
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaTag />
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FaCommentDots className="text-blue-500" />
                      Nội dung chi tiết
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-gray-400">
                        <FaCommentDots />
                      </div>
                      <textarea
                        rows="6"
                        value={form.message}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl
                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                                 placeholder-gray-400 resize-none transition-all"
                      />
                      <div className="absolute right-3 bottom-3 text-sm text-gray-400">
                        {form.message.length}/1000
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <SubmitButton 
                      loading={loading} 
                      onClick={handleSubmit}
                      className="w-full py-3.5 text-lg font-semibold rounded-xl
                               bg-gradient-to-r from-blue-600 to-cyan-600
                               hover:from-blue-700 hover:to-cyan-700
                               transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-3">
                        {loading ? (
                          "Đang gửi..."
                        ) : (
                          <>
                            <FaPaperPlane />
                            Gửi liên hệ ngay
                          </>
                        )}
                      </span>
                    </SubmitButton>
                    
                    {/* Privacy Note */}
                    <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                      <FaInfoCircle className="text-gray-400" />
                      Thông tin của bạn được bảo mật theo chính sách riêng tư
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map & Location Section */}
            <div className="space-y-8">
              {/* Map Container */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaMapMarkerAlt className="text-xl" />
                    Vị trí của chúng tôi
                  </h2>
                  <p className="text-blue-100 mt-2">
                    Ghé thăm trụ sở GoShip để được hỗ trợ trực tiếp
                  </p>
                </div>
                <div className="relative h-[400px]">
                  <iframe
                    src="https://maps.google.com/maps?q=ho%20chi%20minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full"
                    loading="lazy"
                    title="GoShip Headquarters Location"
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                  {/* Map Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-red-500 text-xl mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-800">GoShip Tower</h4>
                        <p className="text-gray-600 text-sm">
                          123 Nguyễn Văn Linh, Quận 7, TP.HCM
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                           Bãi đỗ xe miễn phí | Tiếp cận được
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Note */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaHeadset className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      Cần hỗ trợ ngay lập tức?
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Gọi ngay cho đội ngũ hỗ trợ khách hàng của chúng tôi
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-white rounded-lg border border-blue-200">
                        <span className="font-mono font-bold text-blue-700 text-lg">
                          1800 1234
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        (Miễn phí 24/7)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ/Quick Tips Section */}
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
               Mẹo để nhận phản hồi nhanh nhất
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Mô tả rõ ràng</h4>
                <p className="text-gray-600 text-sm">
                  Cung cấp đầy đủ thông tin và chi tiết vấn đề
                </p>
              </div>
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Chọn đúng loại</h4>
                <p className="text-gray-600 text-sm">
                  Chọn phân loại phù hợp để được chuyển đúng bộ phận
                </p>
              </div>
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Thông tin liên hệ</h4>
                <p className="text-gray-600 text-sm">
                  Đảm bảo email và số điện thoại chính xác
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default ContactPage;