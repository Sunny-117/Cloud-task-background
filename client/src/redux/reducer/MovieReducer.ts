import { Reducer } from "react";
import { ISearchCondition } from "../../services/CommonTypes";
import { IMovie } from "../../services/MovieService";
import {
  DeleteAction,
  MovieActions,
  MovieChangeSwitchAction,
  SaveMoviesAction,
  SetConditionAction,
  SetLoadingAction,
} from "../actions/MovieAction";

export type IMovieCondition = Required<ISearchCondition>; //全部变成必填了
// 描述电影列表的状态类型
/**
 * 电影状态
 */
export interface IMovieState {
  /**
   * 电影数组
   */
  data: IMovie[];
  /**
   * 查询条件
   */
  condition: IMovieCondition;
  /**
   * 总记录数
   */
  total: number;
  /**
   * 是否正在加载数据
   */
  isLoading: boolean;
  /**
   * 总页数
   */
  totalPage: number;
}

const defaultState: IMovieState = {
  data: [],
  condition: {
    page: 1,
    limit: 10,
    key: "",
  },
  total: 0,
  isLoading: false,
  totalPage: 0,
};

// function saveMovie(state:IMovieState, action: SaveMoviesAction):IMovieState {

// }
type MovieReducer<A> = Reducer<IMovieState, A>;
const saveMovie: MovieReducer<SaveMoviesAction> = function (state, action) {
  // return Object.assign({}, state, {
  //   data: action.payload.movies,
  //   total: action.payload.total,
  // });
  return {
    ...state,
    data: action.payload.movies,
    total: action.payload.total,
    totalPage: Math.ceil(action.payload.total / state.condition.limit),
  };
};
const setCondition: MovieReducer<SetConditionAction> = function (
  state,
  action
) {
  const newState = {
    ...state,
    condition: {
      ...state.condition,
      ...action.payload,
    },
  };
  // 为什么新开一个？因为limit不方便获取，可能来自state，可能来自action.payload
  newState.totalPage = Math.ceil(newState.total / newState.condition.limit);
  return newState;
};
const setLoading: MovieReducer<SetLoadingAction> = function (state, action) {
  return {
    ...state,
    isLoading: action.payload,
  };
};
const deleteMovie: MovieReducer<DeleteAction> = function (state, action) {
  return {
    ...state,
    data: state.data.filter((m) => m._id !== action.payload),
    total: state.total - 1,
    totalPage: Math.ceil((state.totalPage - 1) / state.condition.limit),
  };
};

const changeSwitch: MovieReducer<MovieChangeSwitchAction> = function (
  state,
  action
) {
  // action.payload
  // 1. 根据id找到对象
  const movie = state.data.find((d) => d._id === action.payload.id);
  if (!movie) {
    return state;
  }
  // 2. 对象克隆
  const newMovie = { ...movie };
  newMovie[action.payload.type] = action.payload.newVal; // 索引签名
  // 3. 将对象重新放入到数组
  // 得到跟原来一模一样，只有改变的哪一项不同的数组
  const newData = state.data.map((d) => {
    if (d._id === action.payload.id) {
      // 要改变的数据
      return newMovie;
    }
    // 不需要改变的数据;
    return d;
  });
  return {
    ...state,
    data: newData, //覆盖原来的属性  排错：action reducer 界面层层 排除问题
  };
};
export default function (
  state: IMovieState = defaultState,
  action: MovieActions
) {
  // action.    // 可辨识的联合
  switch (action.type) {
    case "movie_delete":
      return deleteMovie(state, action);
    case "movies_save":
      return saveMovie(state, action);
    case "movie_setCondition":
      return setCondition(state, action);
    case "movies_setLoading":
      return setLoading(state, action);
    case "movie_switch":
      return changeSwitch(state, action);
    default:
      return state;
  }
}
