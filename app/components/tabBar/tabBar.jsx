import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class TabBar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.tabBar}>
        {this.props.tabs && this.props.tabs.map((tab) => (
          <NavLink to={tab.path} key={tab.path} activeClassName={style.active}>{tab.label}</NavLink>
        ))}
      </div>
    )
  }

}

TabBar.propTypes = {
  tabs: PropTypes.array
}


export default TabBar