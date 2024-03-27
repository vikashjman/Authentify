// utils/authUtils.js

export const isAuthenticated = (role: string | null = null) => {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    const { accessToken, roles } = user;

    if (role) {
      return !!accessToken && roles && roles.includes(role);
    } else {
      return !!accessToken;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    return false;
  }
};
