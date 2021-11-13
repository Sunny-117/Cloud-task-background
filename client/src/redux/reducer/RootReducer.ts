import { combineReducers } from "redux";
import movieReducer, { IMovieState } from "./MovieReducer";
/**
 * 整个网站的根状态
 */
export interface IRootState {
  movie: IMovieState;
}
export const rootReducer = combineReducers({
  movie: movieReducer,
});
