import React from "react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
        Liên hệ với CourierHub
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <div className="bg-white p-8 rounded-xl shadow border">
          <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn</h2>

          <form className="grid gap-6">
            <input
              placeholder="Họ và tên"
              className="px-4 py-3 border rounded-lg"
            />
            <input
              placeholder="Email"
              className="px-4 py-3 border rounded-lg"
            />
            <textarea
              rows="5"
              placeholder="Nội dung..."
              className="px-4 py-3 border rounded-lg"
            />

            <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Gửi ngay
            </button>
          </form>
        </div>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden shadow border">
          <iframe
            src="https://maps.google.com/maps?q=ho%20chi%20minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[350px]"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
