import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerAPI = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginAPI = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

export const forgotPasswordAPI = (data) =>
  axios.post(`${API_URL}/forgot-password`, data).then(res => res.data);

export const resetPasswordAPI = (data) =>
  axios.post(`${API_URL}/reset-password`, data).then(res => res.data);

export const validateResetTokenAPI = (data) =>
  axios.post(`${API_URL}/validate-reset-token`, data).then(res => res.data);

// ================= CHANGE PASSWORD (authenticated) =================
export const changePasswordAPI = async (data, token) => {
  const res = await axios.post(`${API_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const logoutAPI = async (token) => {
  const res = await axios.post(
    `${API_URL}/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getCurrentUser = async (token) => {
  const res = await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const checkUsernameExists = async (username) => {
  const res = await axios.post(`${API_URL}/check-username`, { username });
  return res.data.exists; 
};

// ================= GET USER PROFILE =================
export const getProfileAPI = async (accountId, token) => {
  const res = await axios.get(`${API_URL}/profile/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// ================= UPDATE USER PROFILE =================
export const updateProfileAPI = async (accountId, data, token) => {
  const res = await axios.put(`${API_URL}/profile/${accountId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};