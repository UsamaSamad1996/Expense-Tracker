import { legacy_createStore as createStore } from "redux";
import combineAllReducers from "./CombineReducer";

export const store = createStore(combineAllReducers);
