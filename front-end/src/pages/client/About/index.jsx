import React from "react";
import { FaTruck, FaUsers, FaCheckCircle } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Giới thiệu GoShip</h1>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto">
          Nền tảng chuyển phát nhanh – chính xác – theo dõi thời gian thực, dành cho cá nhân và doanh nghiệp.
        </p>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src="https://img.freepik.com/free-vector/delivery-concept-illustration_114360-2292.jpg"
          alt="About CourierHub"
          className="rounded-xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CourierHub hướng tới việc xây dựng hệ thống chuyển phát linh hoạt, minh bạch và hiệu quả cao.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi cam kết giúp doanh nghiệp tiết kiệm thời gian, chi phí và tăng độ hài lòng khách hàng.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: FaTruck, label: "Đơn hàng mỗi tháng", value: "80K+" },
            { icon: FaUsers, label: "Khách hàng tin dùng", value: "40K+" },
            { icon: FaCheckCircle, label: "Tỉ lệ chính xác", value: "99%" },
            { icon: FaTruck, label: "Tỉnh thành phủ sóng", value: "63" },
          ].map((item, i) => (
            <div key={i}>
              <item.icon className="text-blue-600 text-3xl mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
