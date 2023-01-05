import AccountingReducer from "./AccountingReducer/AccountingReducer";
import AuthReducer from "./AuthReducer/AuthReducer";

import { combineReducers } from "redux";

const combineAllReducers = combineReducers({
  AccountingReducer,
  AuthReducer,
});

export default combineAllReducers;
