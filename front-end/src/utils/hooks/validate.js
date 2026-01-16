export const FieldValidator = {
  validateEmail: (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  validatePhone: (phone) =>
    /^(0|84)[0-9]{9}$/.test(phone.replace(/\s/g, "")),

  validateStep: (step, form) => {
    console.log("🧪 VALIDATE STEP:", step, form);
    const errors = {};

    /* ========== STEP 0: SENDER ========== */
    if (step === 0) {
      const fullName = form.sender.full_name || "";
      const phone = form.sender.phone || "";
      const address = form.sender.address || "";
      const city = form.sender.city || "";

      !fullName.trim() &&
        (errors.senderFull_name = "Tên không được để trống");

      !phone &&
        (errors.senderPhone = "Số điện thoại không được để trống");

      phone &&
        !FieldValidator.validatePhone(phone) &&
        (errors.senderPhone = "SĐT không hợp lệ (0xxxxxxxxx)");

      form.sender.email &&
        !FieldValidator.validateEmail(form.sender.email) &&
        (errors.senderEmail = "Email không hợp lệ");

      !address.trim() &&
        (errors.senderAddress = "Địa chỉ không được để trống");

      !city.trim() &&
        (errors.senderCity = "Thành phố không được để trống");
    }

    /* ========== STEP 1: RECEIVER ========== */
    if (step === 1) {
      const fullName = form.receiver.full_name || "";
      const phone = form.receiver.phone || "";
      const address = form.receiver.address || "";
      const city = form.receiver.city || "";

      !fullName.trim() &&
        (errors.receiverFull_name = "Tên không được để trống");

      !phone &&
        (errors.receiverPhone = "Số điện thoại không được để trống");

      phone &&
        !FieldValidator.validatePhone(phone) &&
        (errors.receiverPhone = "SĐT không hợp lệ (0xxxxxxxxx)");

      form.receiver.email &&
        !FieldValidator.validateEmail(form.receiver.email) &&
        (errors.receiverEmail = "Email không hợp lệ");

      !address.trim() &&
        (errors.receiverAddress = "Địa chỉ không được để trống");

      !city.trim() &&
        (errors.receiverCity = "Thành phố không được để trống");
    }

    /* ========== STEP 2: PACKAGE ========== */
    if (step === 2) {
      (!form.package.weight || form.package.weight <= 0) &&
        (errors.weight = "Cân nặng phải > 0");

      !form.package.description.trim() &&
        (errors.description = "Mô tả không được để trống");
    }

    /* ========== STEP 3: PAYMENT  ========== */
    if (step === 3) {
      console.log("💳 PAYMENT =", form.payment);
      if (!form.payment) {
        errors.payment = "Vui lòng chọn phương thức thanh toán";
      }
      const ALLOWED = ["CASH", "MOMO", "PAYPAL"];
      if (form.payment && !ALLOWED.includes(form.payment)) {
        errors.payment = "Phương thức thanh toán không hợp lệ";
      }
    }

    return errors;
  },
};
