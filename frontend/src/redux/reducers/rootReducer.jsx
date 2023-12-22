import { combineReducers } from "redux";

import callStatus from "./callStatus";
import streamsReducer from "./streamsReducer";

const rootReducer = combineReducers({
  callStatus: callStatus,
  streams: streamsReducer
});

export default rootReducer;
