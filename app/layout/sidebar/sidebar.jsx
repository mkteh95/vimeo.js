import React from 'react'
import { NavLink } from 'react-router-dom'

import style from './style.scss'


class Sidebar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <aside className={style.sidebar}>
        <div className={style.list}>
         <span className={style.title}>BROWSE</span>
          <NavLink to="/categories" activeClassName={style.active}>
            <i className="fa fa-th fa-fw"></i> Categories
          </NavLink>
          <NavLink to="/channels" activeClassName={style.active}>
            <i className="fa fa-tv fa-fw"></i> Channels
          </NavLink>
          <NavLink to="/groups" activeClassName={style.active}>
            <i className="fa fa-group fa-fw"></i> Groups
          </NavLink>
        </div>
        <div className={style.list}>
          <span className={style.title}>YOUR VIDEOS</span>
          <NavLink to="/me/feed" exact activeClassName={style.active}>
            <i className="fa fa-feed fa-fw"></i> Feed
          </NavLink>
          <NavLink to="/me/likes" activeClassName={style.active}>
            <i className="fa fa-heart fa-fw"></i> Likes
          </NavLink>
          <NavLink to="/me/watchlater" activeClassName={style.active}>
            <i className="fa fa-clock-o fa-fw"></i> Watch Later
          </NavLink>
        </div>
      </aside>
    )
  }

}

export default Sidebar