/////////////

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

/////

export const loggingOut = (error) => ({
  type: "LOG_OUT",
  payload: error,
});
