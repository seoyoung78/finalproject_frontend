import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import hospitalReducer from "./hospital-reducer";

const rootReducer = combineReducers({
  authReducer: authReducer,
  hospitalReducer: hospitalReducer,
});

export default rootReducer;
