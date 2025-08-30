export const ENDPOINTS = {
  signupEmail: "/auth/signupEmail",
  login: "/auth/login",
  logout: "/auth/logout", // '/auth/logout' -> '/api/auth/logout'으로 변경
  me: "/users/me", // '/auth/check-login' -> '/api/users/me'로 변경
} as const;
