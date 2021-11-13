import React from 'react'
import MovieForm from '../../components/MovieForm'
import { MovieService } from '../../services/MovieService'

export default class extends React.Component {
    render() {
        return (
            <MovieForm onSubmit={async (movie) => {
                const resp = await MovieService.add(movie)
                if (resp.data) {
                    // 成功了
                    return ''
                } else {
                    return resp.err
                }
                // return '错了'
                // return ''
            }} />

        )
    }
}