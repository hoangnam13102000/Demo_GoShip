const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {children}
        </div>

        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Bảo vệ bởi mã hóa SSL 256-bit</p>
          <p className="mt-2">
            <a href="#privacy" className="hover:text-blue-600">
              Chính sách bảo mật
            </a>{" "}
            •{" "}
            <a href="#terms" className="hover:text-blue-600">
              Điều khoản sử dụng
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
