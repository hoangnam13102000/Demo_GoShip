import { FaBox } from "react-icons/fa";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 pt-10 pb-8 px-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-white p-3 rounded-lg">
          <FaBox className="text-blue-600 text-3xl" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-blue-100 mt-1">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
