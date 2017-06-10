import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getEntity, getVideos } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'


class EntityPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      entity: {},
      videos: [],
      nextPage: 1
    }
    
    this.fetchVideos = this.fetchVideos.bind(this)
  }

  componentWillMount() {
    getEntity(this.props.match.url).then((response) => {
      this.setState({
        entity: response
      })
    })
  }

  fetchVideos(page) {
    getVideos(`${this.props.match.url}/videos`, { page: page, sort: 'date' }).then((response) => {
      this.setState({
        videos: [...this.state.videos, ...response.videos],
        nextPage: response.paging.next
      })
    })
  }

  render() {
    const followEndpoint = `/me${this.props.match.url}`
    const controls = [<FollowButton uri={followEndpoint} key={followEndpoint} />]
    
    return (
      <LazyContainer nextPage={this.state.nextPage} onLazy={this.fetchVideos}>
        <CollapsibleTitleBar title={this.state.entity.name}
          label={this.props.match.params.page}
          description={this.state.entity.description}
          picture={this.state.entity.picture}
          controls={controls} />
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


export default EntityPage