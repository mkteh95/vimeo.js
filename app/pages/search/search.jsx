import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getChannels, getGroups, getUsers, getVideos } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import MediumGrid from '../../containers/mediumGrid/mediumGrid.jsx'
import LargeGrid from '../../containers/largeGrid/largeGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import Card from '../../components/card/card.jsx'
import UserThumbnail from '../../components/userThumbnail/userThumbnail.jsx'
import Filter from '../../components/filter/filter.jsx'


class SearchPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = this.initialState
    this.handleFilter = this.changeFilter.bind(this)
  }
  
  get initialState() {
    return {
      users: new Map(),
      channels: new Map(),
      groups: new Map(),
      videos: new Map(),
      filter: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.query !== nextProps.match.params.query) {
      this.setState(this.initialState)
      this.handleFilter = this.changeFilter.bind(this)
    } else if (this.props.match.params.type !== nextProps.match.params.type) {
      this.setState({
        filter: null
      })

      this.handleFilter = this.changeFilter.bind(this)
    }
  }

  fetchSearchResults(type, page) {
    let fetchFunction

    if (type === 'users') {
      fetchFunction = getUsers
    } else if (type === 'channels') {
      fetchFunction = getChannels
    } else if (type === 'groups') {
      fetchFunction = getGroups
    } else if (type === 'videos') {
      fetchFunction = getVideos
    }

    fetchFunction(`/${type}`, { query: this.props.match.params.query, page: page, ...this.state.filter }).then((response) => {
      const curr = this.state[type].get(this.state.filter)

      this.state[type].set(this.state.filter, { 
        [type]: (curr[type]) ? [...curr[type], ...response[type]] : response[type],
        nextPage: response.paging.next
      })

      this.setState({
        [type]: this.state[type]
      })
    })
  }

  changeFilter(selected) {
    const params = this.props.match.params

    if (this.state[params.type].has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state[params.type].set(selected.value, {
        [params.type]: null,
        nextPage: 1
      })

      this.setState({
        [params.type]: this.state[params.type],
        filter: selected.value
      })
    }
  }

  render() {
    const params = this.props.match.params
    const tabs = [{ path: `/search/users/${this.props.match.params.query}`, label: "PEOPLE" },
                  { path: `/search/channels/${this.props.match.params.query}`, label: "CHANNELS" },
                  { path: `/search/groups/${this.props.match.params.query}`, label: "GROUPS" },
                  { path: `/search/videos/${this.props.match.params.query}`, label: "VIDEOS" }]

    return (
      <LazyContainer nextPage={(this.state.filter === null) ? null : this.state[params.type].get(this.state.filter).nextPage}
        onLazy={this.fetchSearchResults.bind(this, params.type)}>
        <CollapsibleTitleBar title={`Search Results for ${params.query}`} tabs={tabs} />
        <Filter type={params.type}
          onChanged={this.handleFilter}/>
        <Switch>
          <Route path="/search/users" render={() => (
            <MediumGrid>
            {this.state.users.has(this.state.filter) &&
              this.state.users.get(this.state.filter).users &&
              this.state.users.get(this.state.filter).users.map((user) => (
                <UserThumbnail picture={user.picture}
                  title={user.name}
                  followers={user.followers}
                  videos={user.videos}
                  uri={user.uri}
                  key={user.uri} />
              ))
            }</MediumGrid>
          )} />
          <Route path="/search/channels" render={() => (
            <LargeGrid>
              {this.state.channels.has(this.state.filter) &&
                this.state.channels.get(this.state.filter).channels &&
                this.state.channels.get(this.state.filter).channels.map((channel) => (
                  <Card banner={channel.banner} 
                    title={channel.name}
                    privacy={channel.privacy}
                    link={channel.link}
                    description={channel.description}
                    followers={channel.followers}
                    videos={channel.videos}
                    uri={channel.uri}
                    key={channel.uri} />
                ))
              }</LargeGrid>
            )} />
          <Route path="/search/groups" render={() => (
            <SmallGrid>
            {this.state.groups.has(this.state.filter) &&
              this.state.groups.get(this.state.filter).groups &&
              this.state.groups.get(this.state.filter).groups.map((group) => (
                <Card banner={group.picture} 
                  privacy={group.privacy}
                  link={group.link}
                  title={group.name}
                  followers={group.followers}
                  videos={group.videos}
                  uri={group.uri}
                  key={group.uri} />
              ))
            }</SmallGrid>
          )} />
          <Route path="/search/videos" render={() => (
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
          )} />
        </Switch>
      </LazyContainer>
    )
  }

}


export default SearchPage