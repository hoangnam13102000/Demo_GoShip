import { FaPlus } from "react-icons/fa";

const CreateButton = ({
  label = "Thêm",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 font-medium z-40"
    >
      <FaPlus size={20} />
      {label}
    </button>
  );
};

export default CreateButton;
