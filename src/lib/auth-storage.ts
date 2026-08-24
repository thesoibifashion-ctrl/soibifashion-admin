const ACCESS_TOKEN_KEY = "accessToken";

export const authStorage = {
  getToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
