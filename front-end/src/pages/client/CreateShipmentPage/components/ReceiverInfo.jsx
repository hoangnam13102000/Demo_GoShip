import InputField from '../../../../components/common/InputField';
import { FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ReceiverInfo = ({ form, errors, updateForm }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FaUser className="text-blue-600" /> Thông tin người nhận
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField 
          label="Tên người nhận *" 
          icon={FaUser}
          value={form.receiver.name} 
          onChange={(v) => updateForm('receiver', 'name', v)} 
          error={errors.receiverName} 
        />
        <InputField 
          label="Số điện thoại *" 
          icon={FaPhone}
          value={form.receiver.phone} 
          onChange={(v) => updateForm('receiver', 'phone', v)} 
          error={errors.receiverPhone} 
          placeholder="0901234567" 
        />
      </div>
      <InputField 
        label="Email (tuỳ chọn)" 
        type="email" 
        value={form.receiver.email} 
        onChange={(v) => updateForm('receiver', 'email', v)} 
        error={errors.receiverEmail} 
      />
      <InputField 
        label="Địa chỉ *" 
        icon={FaMapMarkerAlt}
        value={form.receiver.address} 
        onChange={(v) => updateForm('receiver', 'address', v)} 
        error={errors.receiverAddress} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField 
          label="Thành phố *" 
          value={form.receiver.city} 
          onChange={(v) => updateForm('receiver', 'city', v)} 
          error={errors.receiverCity} 
        />
        <InputField 
          label="Mã bưu điện" 
          value={form.receiver.postcode} 
          onChange={(v) => updateForm('receiver', 'postcode', v)} 
        />
      </div>
    </div>
  );
};

export default ReceiverInfo;