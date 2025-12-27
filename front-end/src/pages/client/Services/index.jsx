import React from "react";
import { FaFileAlt, FaBox, FaRocket, FaCheckCircle } from "react-icons/fa";

const ServicesPage = () => {
  const list = [
    {
      icon: FaFileAlt,
      title: "Tài liệu",
      desc: "Gửi giấy tờ – hợp đồng – chứng từ an toàn.",
      color: "from-cyan-600 to-cyan-700"
    },
    {
      icon: FaBox,
      title: "Kiện hàng",
      desc: "Phù hợp shop online, doanh nghiệp vừa & nhỏ.",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: FaRocket,
      title: "Express",
      desc: "Giao siêu tốc cho đơn hàng quan trọng.",
      color: "from-purple-600 to-purple-700"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
        Dịch vụ của CourierHub
      </h1>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {list.map((item, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow border hover:shadow-lg transition"
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl mb-6`}>
              <item.icon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 mb-6">{item.desc}</p>

            <ul className="space-y-2">
              {["An toàn", "Nhanh chóng", "Theo dõi realtime"].map((x, k) => (
                <li key={k} className="flex items-center gap-2 text-gray-600">
                  <FaCheckCircle className="text-blue-500" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ServicesPage;
