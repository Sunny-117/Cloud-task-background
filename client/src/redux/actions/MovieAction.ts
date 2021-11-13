// action创建函数
import { ThunkAction } from "redux-thunk";
import { ISearchCondition, SwitchType } from "../../services/CommonTypes";
import { IMovie, MovieService } from "../../services/MovieService";
import { IRootState } from "../reducer/RootReducer";
import { IAction } from "./ActionTypes";

export type SaveMoviesAction = IAction<
  "movies_save",
  {
    movies: IMovie[];
    total: number;
  }
>;
// 相当于
// type saveMoviesAction = {
//   type: "movies_save";
//   payload: {
//     movies: IMovie[];
//     total: number;
//   };
// };
// 以前的写法：但是没有类型检查
/* export function saveMoviesAction(movies, total) {
  return {
    type: "movie_save",
    payload: {
      movies,
      total,
    },
  };
} */
// 加上ts
// 每个action必须有一个type和payload
function saveMoviesAction(movies: IMovie[], total: number): SaveMoviesAction {
  return {
    type: "movies_save",
    payload: {
      movies,
      total,
    },
  };
}
export type SetLoadingAction = IAction<"movies_setLoading", boolean>;
function setLoadingAction(isLoading: boolean): SetLoadingAction {
  return {
    type: "movies_setLoading",
    payload: isLoading,
  };
}
export type SetConditionAction = IAction<
  "movie_setCondition",
  ISearchCondition
>;
function setConditionAction(condition: ISearchCondition): SetConditionAction {
  return {
    type: "movie_setCondition",
    payload: condition,
  };
}
export type DeleteAction = IAction<"movie_delete", string>;
function deleteAction(id: string): DeleteAction {
  return {
    type: "movie_delete",
    payload: id,
  };
}
/**
 * 根据条件从服务器获取电影数据
 */
function fetchMovies(
  condition: ISearchCondition
): ThunkAction<Promise<void>, IRootState, any, MovieActions> {
  // R函数返回值；
  // S整个网站的根状态；
  // E 额外参数，不需要
  // A action类型
  return async (dispatch, getState) => {
    // 1. 设置加载状态
    dispatch(setLoadingAction(true));
    // 2. 设置条件
    dispatch(setConditionAction(condition));
    // 3. 获取服务器数据
    const curCondition = getState().movie.condition;
    const resp = await MovieService.getMovies(curCondition);
    // 这里不能直接按照condition查询，因为会导致参数缺失，应该用这里的condition覆盖原有condition
    //  4. 更改仓库数据
    dispatch(saveMoviesAction(resp.data, resp.total));
    // 关闭加载状态
    dispatch(setLoadingAction(false));
  };
}
function deleteMovie(
  id: string
): ThunkAction<Promise<void>, IRootState, any, MovieActions> {
  return async (dispatch) => {
    dispatch(setLoadingAction(true));
    await MovieService.delete(id);
    dispatch(deleteAction(id)); //删除本地仓库中的数据
    dispatch(setLoadingAction(false));
  };
}
function changeSwitch(
  type: SwitchType,
  newVal: boolean,
  id: string
): ThunkAction<Promise<void>, IRootState, any, MovieActions> {
  return async (dispatch) => {
    dispatch(changeSwitchAction(type, newVal, id));
    await MovieService.edit(id, {
      [type]: newVal, //修改的时候想写多少就写多少，不需要全部写上，所以需要类型演算
    });
  };
}
export type MovieChangeSwitchAction = IAction<
  "movie_switch",
  {
    type: SwitchType;
    newVal: boolean;
    id: string;
  }
>;
function changeSwitchAction(
  type: SwitchType,
  newVal: boolean,
  id: string
): MovieChangeSwitchAction {
  return {
    type: "movie_switch",
    payload: {
      type,
      newVal,
      id,
    },
  };
}
export type MovieActions =
  | SaveMoviesAction
  | SetConditionAction
  | SetLoadingAction
  | DeleteAction
  | MovieChangeSwitchAction;
export default {
  saveMoviesAction,
  setLoadingAction,
  setConditionAction,
  deleteAction,
  fetchMovies,
  deleteMovie,
  changeSwitchAction,
  changeSwitch,
};
