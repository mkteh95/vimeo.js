import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getEntity, getVideos } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'
import Filter from '../../components/filter/filter.jsx'


class EntityPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      entity: {},
      videos: new Map(),
      filter: null
    }
    
    this.fetchVideos = this.fetchVideos.bind(this)
    this.handleFilter = this.changeFilter.bind(this)
  }

  componentWillMount() {
    getEntity(this.props.match.url).then((response) => {
      this.setState({
        entity: response
      })
    })
  }

  fetchVideos(page) {
    getVideos(`${this.props.match.url}/videos`, { page: page, ...this.state.filter }).then((response) => {
      const curr = this.state.videos.get(this.state.filter)

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

  render() {
    const followEndpoint = `/me${this.props.match.url}`
    const controls = [<FollowButton uri={followEndpoint} key={followEndpoint} />]
    
    return (
      <LazyContainer nextPage={(this.state.filter === null) ? null : this.state.videos.get(this.state.filter).nextPage} 
        onLazy={this.fetchVideos}>
        <CollapsibleTitleBar title={this.state.entity.name}
          label={this.props.match.params.page}
          description={this.state.entity.description}
          picture={this.state.entity.picture}
          controls={controls} />
        <Filter type={this.props.match.params.page}
          onChanged={this.handleFilter} />
        <SmallGrid>
        {this.state.videos.has(this.state.filter) &&
          this.state.videos.get(this.state.filter).videos &&
          this.state.videos.get(this.state.filter).videos.map((video) => (
            <Preview plays={video.plays}
              privacy={video.privacy}
              link={video.link}
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


export default EntityPage