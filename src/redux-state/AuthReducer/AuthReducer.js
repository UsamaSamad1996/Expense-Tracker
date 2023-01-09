const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        error: state.error,
      };
    case "LOG_OUT":
      return {
        user: action.payload,
        error: state.error,
      };
    default:
      return state;
  }
};

export default AuthReducer;
