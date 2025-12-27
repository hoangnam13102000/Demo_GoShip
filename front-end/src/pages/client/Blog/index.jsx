import React from "react";

const BlogPage = () => {
  const posts = [
    {
      title: "Tối ưu hóa giao hàng cho shop online",
      desc: "5 mẹo giúp shop tăng tốc độ giao hàng.",
      img: "https://img.freepik.com/free-vector/delivery-concept-illustration_114360-2292.jpg",
    },
    {
      title: "Cách hoạt động của real-time tracking",
      desc: "Tìm hiểu công nghệ định vị đơn hàng.",
      img: "https://img.freepik.com/free-vector/logistics-concept-illustration_114360-4881.jpg",
    },
    {
      title: "Logistics thời đại 4.0",
      desc: "Tự động hóa & AI trong vận chuyển hiện đại.",
      img: "https://img.freepik.com/free-vector/delivery-concept-illustration_114360-704.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">Blog CourierHub</h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {posts.map((p, i) => (
          <div key={i} className="bg-gray-50 rounded-xl shadow border overflow-hidden hover:shadow-lg transition">
            <img src={p.img} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{p.title}</h3>
              <p className="text-gray-600 mb-4">{p.desc}</p>
              <a className="text-blue-600 font-medium hover:underline cursor-pointer">Đọc thêm →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
