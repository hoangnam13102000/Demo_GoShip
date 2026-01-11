// components/common/validators/FieldValidator.js
export const FieldValidator = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  validatePhone: (phone) => /^(0|84)[0-9]{9}$/.test(phone.replace(/\s/g, '')),
  
  validateStep: (step, form) => {
    const errors = {};

    if (step === 0) {
      !form.sender.name.trim() && (errors.senderName = 'Tên không được để trống');
      !form.sender.phone && (errors.senderPhone = 'Số điện thoại không được để trống');
      form.sender.phone && 
        !FieldValidator.validatePhone(form.sender.phone) && 
        (errors.senderPhone = 'SĐT không hợp lệ (0xxxxxxxxx)');
      form.sender.email && 
        !FieldValidator.validateEmail(form.sender.email) && 
        (errors.senderEmail = 'Email không hợp lệ');
      !form.sender.address.trim() && (errors.senderAddress = 'Địa chỉ không được để trống');
      !form.sender.city.trim() && (errors.senderCity = 'Thành phố không được để trống');
    }

    if (step === 1) {
      !form.receiver.name.trim() && (errors.receiverName = 'Tên không được để trống');
      !form.receiver.phone && (errors.receiverPhone = 'Số điện thoại không được để trống');
      form.receiver.phone && 
        !FieldValidator.validatePhone(form.receiver.phone) && 
        (errors.receiverPhone = 'SĐT không hợp lệ (0xxxxxxxxx)');
      form.receiver.email && 
        !FieldValidator.validateEmail(form.receiver.email) && 
        (errors.receiverEmail = 'Email không hợp lệ');
      !form.receiver.address.trim() && (errors.receiverAddress = 'Địa chỉ không được để trống');
      !form.receiver.city.trim() && (errors.receiverCity = 'Thành phố không được để trống');
    }

    if (step === 2) {
      !form.package.weight || form.package.weight <= 0 
        ? (errors.weight = 'Cân nặng phải > 0') 
        : null;
      !form.package.description.trim() && (errors.description = 'Mô tả không được để trống');
    }

    return errors;
  },
};