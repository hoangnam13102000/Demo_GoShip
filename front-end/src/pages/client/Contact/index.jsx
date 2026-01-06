import React, { useState } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("Contact form:", form);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
        Liên hệ với CourierHub
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* FORM */}
        <div className="bg-white p-8 rounded-xl shadow border">
          <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn</h2>

          <div className="space-y-6">
            <InputField
              label="Họ và tên"
              icon={FaUser}
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nguyễn Văn A"
            />

            <InputField
              label="Email"
              icon={FaEnvelope}
              value={form.email}
              onChange={handleChange("email")}
              placeholder="example@courier.com"
            />

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-gray-400">
                  <FaCommentDots />
                </div>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Nhập nội dung liên hệ..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg
                             focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Submit */}
            <SubmitButton loading={loading} onClick={handleSubmit}>
              Gửi ngay
            </SubmitButton>
          </div>
        </div>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden shadow border">
          <iframe
            src="https://maps.google.com/maps?q=ho%20chi%20minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[350px]"
            loading="lazy"
            title="CourierHub Location"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
