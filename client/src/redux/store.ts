import { applyMiddleware, createStore } from "redux";
import { IRootState, rootReducer } from "./reducer/RootReducer";
import logger from "redux-logger"; // 想获得类型检查，需要安装类型库@types/react-router
import thunk, { ThunkMiddleware } from "redux-thunk";
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<IRootState>, logger)
);
