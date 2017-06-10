import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import Header from '../header/header.jsx'
import CategoriesPage from '../../pages/categories/categories.jsx'
import ChannelsPage from '../../pages/channels/channels.jsx'
import GroupsPage from '../../pages/groups/groups.jsx'
import SearchPage from '../../pages/search/search.jsx'
import ProfilePage from '../../pages/profile/profile.jsx'
import MyVideosPage from '../../pages/myVideos/myVideos.jsx'
import VideoPage from '../../pages/video/video.jsx'
import EntityPage from '../../pages/entity/entity.jsx'

import style from './style.scss'


class Content extends React.Component {

  render() {

    return (
      <main className={style.appContent}>
        <Header user={JSON.parse(localStorage.getItem('user'))} />
        <div className={style.contentWrapper}>
          <Switch>
            <Route path="/users/:user/:tab" component={ProfilePage} />
            <Route path="/users/:user" render={(props) => { return <Redirect to={`${props.match.url}/likes`} />;}} />
            <Route path="/search/:type/:query" component={SearchPage} />
            <Route path="/search/:query" render={(props) => (<Redirect to={`/search/users/${props.match.params.query}`} />)} />
            <Route path="/me/:page" component={MyVideosPage} />
            <Route path="/videos/:video" component={VideoPage} />
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/channels" component={ChannelsPage} />
            <Route path="/groups" component={GroupsPage} />
            <Route path="/:page/:id" component={EntityPage} />
            <Redirect to="/categories" />
          </Switch>
        </div>
      </main>
    )
  }

}

Content.contextTypes = {
  store: PropTypes.object
}

export default Content