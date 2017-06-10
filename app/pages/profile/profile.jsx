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


class ProfilePage extends React.Component {

  constructor(props) {
    super(props)

    this.tabs = ['likes', 'videos', 'albums', 'channels', 'groups', 'portfolios', 'followers', 'following']

    this.state = {
      initialized: false,
      user: {}
    }

    for (let tab of this.tabs) {
      this.state[tab] = { [tab]: [], nextPage: 1 }
    }
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
        initialized: false
      })
      
      this.initialDataLoad(nextProps)
    }
  }

  fetchData(tab, page) {
    const [fetchFunction, responseType] = (tab === 'followers' || tab === 'following') 
                                            ? [getUsers.bind(this, this.props.match.url), 'users']
                                            : (tab === 'likes' || tab === 'videos') 
                                              ? [getVideos.bind(this, this.props.match.url), 'videos'] 
                                              : [getListings.bind(this, this.props.match.url, 'listings'), 'listings']

    fetchFunction({ page: page }).then((response) => {
      this.setState({
        [tab]: {
          [tab]: [...this.state[tab][tab], ...response[responseType]],
          nextPage: response.paging.next
        }
      })
    })
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
            <LazyContainer nextPage={this.state[params.tab].nextPage} onLazy={this.fetchData.bind(this, params.tab)}>
              <CollapsibleTitleBar title={this.state.user.name}
                label="PROFILE"
                description={this.state.user.description}
                picture={this.state.user.picture}
                tabs={tabs}
                controls={(JSON.parse(localStorage.getItem('user')).uri === `/users/${this.props.match.params.user}`) ? null : controls} />
              <Switch>
                <Route path={"/users/:user/:tab(likes|videos)"} render={() => (
                    <SmallGrid>{
                        this.state[params.tab][params.tab].map((item) => (
                          <Preview plays={item.plays}
                            likes={item.likes}
                            comments={item.comments.total}
                            picture={item.picture}
                            title={item.name}
                            duration={item.duration}
                            user={item.user}
                            uri={item.uri}
                            key={item.uri} />
                        ))
                      }</SmallGrid>
                  )} />
                <Route path={"/users/:user/:tab(followers|following)"} render={() => (
                    <MediumGrid>{
                        this.state[params.tab][params.tab].map((item) => (
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
                    <LargeGrid>{
                        this.state[params.tab][params.tab].map((item) => (
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
                    <SmallGrid>{
                        this.state[params.tab][params.tab].map((item) => (
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