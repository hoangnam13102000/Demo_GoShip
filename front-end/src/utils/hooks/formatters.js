export const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num || 0);

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    return dateStr;
  }
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch (e) {
    return dateStr;
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("auth");

    if (userData) return JSON.parse(userData);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user || parsed;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};