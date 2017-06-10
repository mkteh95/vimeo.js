import React from 'react'
import PropTypes from 'prop-types'

import { getVideos } from '../../services/api.js'

import LoadContainer from '../../containers/loadContainer/loadContainer.jsx'
import VideoThumbnail from '../videoThumbnail/videoThumbnail.jsx'

import style from './style.scss'


class RelatedVideos extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      videos: [],
      nextPage: 1
    }

    this.handleFetch = this.fetchVideos.bind(this, this.props.uri)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uri !== nextProps.uri) {
      this.setState({
        videos: [],
        nextPage: 1
      })

      this.handleFetch = this.fetchVideos.bind(this, nextProps.uri)
    }
  }

  fetchVideos(endpoint, page) {
    getVideos(endpoint, { page: page, per_page: 10, filter: 'related' }).then((response) => {
      this.setState({
        videos: [...this.state.videos, ...response.videos],
        nextPage: response.paging.next
      })
    })
  }

  render() {
    return (
      <LoadContainer nextPage={this.state.nextPage} onLoad={this.handleFetch}>
        <div className={style.relatedVideos}>
          {
            this.state.videos.map((video) => (
              <VideoThumbnail picture={video.picture}
                title={video.name}
                duration={video.duration}
                plays={video.plays}
                comments={video.comments.total}
                likes={video.likes}
                user={video.user}
                uri={video.uri}
                key={video.uri} />
            ))
          }
        </div>
      </LoadContainer>
    )
  }

}

RelatedVideos.propTypes = {
  uri: PropTypes.string
}


export default RelatedVideos