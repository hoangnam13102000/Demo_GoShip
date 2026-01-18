export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!token && !!user;
};

export const hasRole = (roles = []) => {
  const user = getUser();
  if (!user) return false;
  return roles.includes(user.role);
};
