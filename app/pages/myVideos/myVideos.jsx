import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getFeeds, getVideos } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Filter from '../../components/filter/filter.jsx'
import Preview from '../../components/preview/preview.jsx'


class MyVideosPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = this.initialState(props)
    
    this.fetchVideos = this.fetchVideos.bind(this)
    this.handleFilter = this.changeFilter.bind(this)
  }

  initialState(props) {
    if (props.match.params.page !== 'watched') {
      return {
        videos: new Map(),
        filter: null
      }
    }

    const videos = new Map()
    const filter = {}

    videos.set(filter, {
      videos: null,
      nextPage: 1
    })

    return {
      videos: videos,
      filter: filter
    }
  }

  extractTitleFromPage(pageName) {
    switch(pageName) {
      case 'likes':
        return 'Likes'

      case 'feed':
        return 'Feed'

      case 'watchlater':
        return 'Watch Later'

      case 'watched':
        return 'Recently Watched'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.url !== nextProps.match.url) {
      this.setState(this.initialState(nextProps))
      this.handleFilter = this.changeFilter.bind(this)
    }
  }

  fetchVideos(page) {
    const fetchFunction = (this.props.match.params.page === 'feed') ? getFeeds : getVideos
    const curr = this.state.videos.get(this.state.filter)

    fetchFunction(this.props.location.pathname, { page: page, ...this.state.filter }).then((response) => {
      this.state.videos.set(this.state.filter, {
        videos: (curr.videos) ? [...curr.videos, ...response.videos] : response.videos,
        nextPage: response.paging.next
      })

      this.setState({
        videos: this.state.videos
      })
    })
  }

  changeFilter(selected) {
    if (this.state.videos.has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state.videos.set(selected.value, {
        videos: null,
        nextPage: 1
      })

      this.setState({
        videos: this.state.videos,
        filter: selected.value
      })
    }
  }

  onUnwatchLater(uri) {
    for (let [key, value] of this.state.videos.entries()) {
      this.state.videos.set(key, {
        videos: value.videos.filter((video) => {
          return video.uri !== uri
        }),
        nextPage: value.nextPage
      })
    }

    this.setState({
      videos: this.state.videos
    })
  }

  render() {
    const params = this.props.match.params

    return (
      <LazyContainer nextPage={(this.state.filter === null) ? null : this.state.videos.get(this.state.filter).nextPage} 
        onLazy={this.fetchVideos}>
        <CollapsibleTitleBar title={this.extractTitleFromPage(params.page)} />
        {params.page !== 'watched' &&
          <Filter type={params.page} 
            onChanged={this.handleFilter} />
        }
        <SmallGrid>
        {this.state.videos.has(this.state.filter) &&
          this.state.videos.get(this.state.filter).videos &&
          this.state.videos.get(this.state.filter).videos.map((video) => (
            <Preview plays={video.plays}
              likes={video.likes}
              comments={video.comments.total}
              picture={video.picture}
              title={video.name}
              duration={video.duration}
              user={video.user}
              watchLater={params.page === 'watchlater'}
              onUnwatchLater={(params.page === 'watchlater') ? this.onUnwatchLater.bind(this) : null}
              uri={video.uri}
              key={video.uri} />
          ))
        }</SmallGrid>
      </LazyContainer>
    )
  }

}


export default MyVideosPage