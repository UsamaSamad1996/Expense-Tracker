import AccountingReducer from "./AccountingReducer";

import { combineReducers } from "redux";

const combineAllReducers = combineReducers({
  AccountingReducer,
});

export default combineAllReducers;
