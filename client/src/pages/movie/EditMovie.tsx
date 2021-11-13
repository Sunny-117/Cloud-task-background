import React from 'react'
import { RouteComponentProps } from 'react-router'
import MovieForm from '../../components/MovieForm'
import { IMovie, MovieService } from '../../services/MovieService'

// 属性的泛型
interface IParams {
    id: string
}
// 状态的泛型
interface EditPageState {
    movie?: IMovie
}
export default class extends React.Component<RouteComponentProps<IParams>, EditPageState> {
    state: EditPageState = {
        // 这里也约束一下，防止写类型的时候写错
        movie: undefined
    }
    async componentDidMount() {
        const resp = await MovieService.getMovieById(this.props.match.params.id)
        if (resp.data) {
            this.setState({
                movie: resp.data
            })
        }
    }

    render() {
        // console.log(this.props.match.params.id)

        return (
            <MovieForm
                movie={this.state.movie}
                onSubmit={async (movie) => {
                    const resp = await MovieService.edit(this.props.match.params.id, movie)
                    if (resp.data) {
                        return ''
                    } else {
                        return resp.err
                    }
                }} />
        )
    }
}