import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getFeeds, getVideos } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'

import Preview from '../../components/preview/preview.jsx'


class MyVideosPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      videos: [],
      nextPage: 1
    }
    
    this.fetchVideos = this.fetchVideos.bind(this)
  }

  extractTitleFromPage(pageName) {
    if (pageName === 'likes') {
      return 'Likes'
    } 
    if (pageName === 'feed') {
      return 'Feed'
    }
    if (pageName === 'watchlater') {
      return 'Watch Later'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.url !== nextProps.match.url) {
      this.setState({
        videos: [],
        nextPage: 1
      })
    }
  }

  fetchVideos(page) {
    const fetchFunction = (this.props.match.params.page === 'feed') ? getFeeds : getVideos
    
    fetchFunction(this.props.match.url, { page: page, sort: 'date' }).then((response) => {
      this.setState({
        videos: [...this.state.videos, ...response.videos],
        nextPage: response.paging.next
      })
    })
  }

  render() {
    return (
      <LazyContainer nextPage={this.state.nextPage} onLazy={this.fetchVideos}>
        <CollapsibleTitleBar title={this.extractTitleFromPage(this.props.match.params.page)} />
        <SmallGrid>{
            this.state.videos.map((video) => (
              <Preview plays={video.plays}
                likes={video.likes}
                comments={video.comments.total}
                picture={video.picture}
                title={video.name}
                duration={video.duration}
                user={video.user}
                uri={video.uri}
                key={video.uri} />
            ))
          }</SmallGrid>
      </LazyContainer>
    )
  }

}


export default MyVideosPage