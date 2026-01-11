
const SummaryCard = ({ title, icon: Icon, data }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h3 className="font-semibold mb-3 flex items-center gap-2">
      <Icon className="text-blue-600" /> {title}
    </h3>
    <div className="space-y-2 text-sm text-gray-700">
      <p><strong>{data.name}</strong></p>
      <p className="flex items-center gap-2"><FaPhone className="text-blue-600" /> {data.phone}</p>
      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-600" /> {data.address}, {data.city}</p>
      {data.postcode && <p className="flex items-center gap-2"><FaBox className="text-gray-600" /> {data.postcode}</p>}
    </div>
  </div>
);
export default SummaryCard;