import React, { Dispatch } from 'react'
import MovieTable from '../../components/MovieTable'
import { connect } from 'react-redux'
import { IRootState } from '../../redux/reducer/RootReducer'
import MovieAction from '../../redux/actions/MovieAction';
import { IMovieState } from '../../redux/reducer/MovieReducer';
import { IMovieTableEvents } from '../../components/MovieTable';// 坑：没有加括号导入会出错
function mapStateToProps(state: IRootState): IMovieState {
    // 映射属性
    return state.movie;
}
function mapDispatchToProps(dispatch: Dispatch<any>): IMovieTableEvents {
    // 映射事件
    return {
        onLoad() {
            dispatch(MovieAction.fetchMovies({
                // 默认值
                page: 1,
                limit: 10,
                key: ""
            }))
        },
        onSwitchChange(type, newState, id) {
            dispatch(MovieAction.changeSwitch(type, newState, id))
        }
        ,
        async onDelete(id) {
            await dispatch(MovieAction.deleteMovie(id))
        }
        ,
        onChange(newPage) {
            dispatch(MovieAction.fetchMovies({
                page: newPage
            }))
        },
        onKeyChange(key) {
            dispatch(MovieAction.setConditionAction({
                key
            }))
        },
        onSearch() {
            dispatch(MovieAction.fetchMovies({
                page: 1//回到第一页
            }))
        }
    }
}
// const HOC = connect(mapStateToProps)
// const MovieContainer = HOC(MovieTable)
// export default class extends React.Component {
//     render() {
//         return (
//             <MovieContainer />
//         )
//     }
// }
// 简化
export default connect(mapStateToProps, mapDispatchToProps)(MovieTable)
// 仓库里面有数据，但是没有界面
// MovieTable里面有界面，但是没有数据
// react-redux

