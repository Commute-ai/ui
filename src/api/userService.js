import apiClient from "./client";

const getMe = (token) => {
  return apiClient.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const userService = {
  getMe,
};

export default userService;
