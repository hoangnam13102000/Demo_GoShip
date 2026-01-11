import InputField from '../../../../components/common/InputField';
import { FaUser, FaPhone, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';

const SenderInfo = ({ form, errors, updateForm }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FaUser className="text-blue-600" /> Thông tin người gửi
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField 
          label="Tên người gửi *" 
          icon={FaUser}
          value={form.sender.name} 
          onChange={(v) => updateForm('sender', 'name', v)} 
          error={errors.senderName} 
        />
        <InputField 
          label="Số điện thoại *" 
          icon={FaPhone}
          value={form.sender.phone} 
          onChange={(v) => updateForm('sender', 'phone', v)} 
          error={errors.senderPhone} 
          placeholder="0901234567" 
        />
      </div>
      <InputField 
        label="Email (tuỳ chọn)" 
        type="email" 
        value={form.sender.email} 
        onChange={(v) => updateForm('sender', 'email', v)} 
        error={errors.senderEmail} 
      />
      <InputField 
        label="Địa chỉ *" 
        icon={FaMapMarkerAlt}
        value={form.sender.address} 
        onChange={(v) => updateForm('sender', 'address', v)} 
        error={errors.senderAddress} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField 
          label="Thành phố *" 
          value={form.sender.city} 
          onChange={(v) => updateForm('sender', 'city', v)} 
          error={errors.senderCity} 
        />
        <InputField 
          label="Mã bưu điện" 
          value={form.sender.postcode} 
          onChange={(v) => updateForm('sender', 'postcode', v)} 
        />
      </div>
    </div>
  );
};

export default SenderInfo;