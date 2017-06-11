import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getUser, getUsers, getVideos, getListings } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import MediumGrid from '../../containers/mediumGrid/mediumGrid.jsx'
import LargeGrid from '../../containers/largeGrid/largeGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import Card from '../../components/card/card.jsx'
import UserThumbnail from '../../components/userThumbnail/userThumbnail.jsx'
import EntityPage from '../entity/entity.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'
import Filter from '../../components/filter/filter.jsx'


class ProfilePage extends React.Component {

  constructor(props) {
    super(props)

    this.tabs = ['likes', 'videos', 'albums', 'channels', 'groups', 'portfolios', 'followers', 'following']

    this.state = {
      initialized: false,
      user: {},
      filter: null
    }

    for (let tab of this.tabs) {
      this.state[tab] = new Map()
    }

    this.handleFilter = this.changeFilter.bind(this)
  }

  initialDataLoad(props) {
    getUser(`/users/${props.match.params.user}`).then((response) => {
      this.setState({
        initialized: true,
        user: response
      })
    })
  }
  
  componentWillMount() {
    this.initialDataLoad(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.user !== nextProps.match.params.user) {
      this.setState({
        initialized: false,
        filter: null
      })
      
      this.initialDataLoad(nextProps)
      this.handleFilter = this.changeFilter.bind(this)
    } else if (this.props.match.params.tab !== nextProps.match.params.type) {
      this.setState({
        filter: null
      })

      this.handleFilter = this.changeFilter.bind(this)
    }
  }

  fetchData(tab, page) {
    const [fetchFunction, responseType] = (tab === 'followers' || tab === 'following') 
                                            ? [getUsers.bind(this, this.props.match.url), 'users']
                                            : (tab === 'likes' || tab === 'videos') 
                                              ? [getVideos.bind(this, this.props.match.url), 'videos'] 
                                              : [getListings.bind(this, this.props.match.url, 'listings'), 'listings']

    fetchFunction({ page: page, ...this.state.filter }).then((response) => {
      this.state[tab].set(this.state.filter, {
        [tab]: [...this.state[tab].get(this.state.filter)[tab], ...response[responseType]],
        nextPage: response.paging.next
      })

      this.setState({
        [tab]: this.state[tab]
      })
    })
  }

  changeFilter(selected) {
    const params = this.props.match.params

    if (this.state[params.tab].has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state[params.tab].set(selected.value, {
        [params.tab]: [],
        nextPage: 1
      })

      this.setState({
        [params.tab]: this.state[params.tab],
        filter: selected.value
      })
    }
  }

  render() {
    const params = this.props.match.params
    const tabs = this.tabs.map((tab) => {
      return { path: `/users/${params.user}/${tab}`, label: tab }
    })
    
    const followEndpoint = `/me/following/${this.props.match.params.user}`
    const controls = [<FollowButton uri={followEndpoint} key={followEndpoint} />]

    return (
      <Switch>
        <Route path="/users/:user/:page/:id" component={EntityPage} />
        {this.state.initialized && <Route path="/users/:user/:tab" render={() => (
            <LazyContainer nextPage={(this.state.filter === null) ? null : this.state[params.tab].get(this.state.filter).nextPage} 
              onLazy={this.fetchData.bind(this, params.tab)}>
              <CollapsibleTitleBar title={this.state.user.name}
                label="PROFILE"
                description={this.state.user.description}
                picture={this.state.user.picture}
                tabs={tabs}
                controls={(JSON.parse(localStorage.getItem('user')).uri === this.state.user.uri) ? null : controls} />
              <Filter type={(params.tab === 'videos') ? 'uploads' : params.tab}
                onChanged={this.handleFilter} />
              <Switch>
                <Route path={"/users/:user/:tab(likes|videos)"} render={() => (
                    <SmallGrid>
                    {this.state[params.tab].has(this.state.filter) &&
                      this.state[params.tab].get(this.state.filter)[params.tab].map((item) => (
                        <Preview plays={item.plays}
                          likes={item.likes}
                          comments={item.comments.total}
                          picture={item.picture}
                          title={item.name}
                          duration={item.duration}
                          user={item.user}
                          uri={item.uri}
                          key={item.uri} />)
                      )
                    }</SmallGrid>
                  )} />
                <Route path={"/users/:user/:tab(followers|following)"} render={() => (
                    <MediumGrid>
                    {this.state[params.tab].has(this.state.filter) &&
                      this.state[params.tab].get(this.state.filter)[params.tab].map((item) => (
                        <UserThumbnail picture={item.picture}
                          title={item.name}
                          followers={item.followers}
                          videos={item.videos}
                          uri={item.uri}
                          key={item.uri} />
                      ))
                    }</MediumGrid>
                  )} />
                <Route path={"/users/:user/:tab(channels|portfolios)"} render={() => (
                    <LargeGrid>
                    {this.state[params.tab].has(this.state.filter) &&
                      this.state[params.tab].get(this.state.filter)[params.tab].map((item) => (
                        <Card banner={item.banner} 
                          title={item.name}
                          description={item.description}
                          followers={item.followers}
                          videos={item.videos}
                          uri={item.uri}
                          key={item.uri} />
                      ))
                    }</LargeGrid>
                  )} />
                <Route path={"/users/:user/:tab(groups|albums)"} render={() => (
                    <SmallGrid>
                    {this.state[params.tab].has(this.state.filter) &&
                      this.state[params.tab].get(this.state.filter)[params.tab].map((item) => (
                        <Card banner={item.picture} 
                          title={item.name}
                          followers={item.followers}
                          videos={item.videos}
                          uri={item.uri}
                          key={item.uri} />
                      ))
                    }</SmallGrid>
                  )} />
              </Switch>
            </LazyContainer>
            )} />}
      </Switch>
    )
  }

}


export default ProfilePage