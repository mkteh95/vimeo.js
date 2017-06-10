import React from 'react'
import PropTypes from 'prop-types'

import TabBar from '../tabBar/tabBar.jsx'

import style from './style.scss'


class TitleBar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div ref="titlebar" className={(this.props.collapsed) ? `${style.titleBar} ${style.collapsed}` : style.titleBar}>
        <div className={style.titleBarWrapper}>
          {this.props.picture && <img src={this.props.picture} />}
          <div className={style.content}>
            <div className={style.heading}>
              {this.props.label && <span className={style.label}>{this.props.label}</span>}
              <h1>{this.props.title}</h1>
              {this.props.description && <div className={style.description}>{this.props.description}</div>}
            </div>
            <div className={style.controls}>
              {this.props.controls}
            </div>
          </div>
        </div>
        {this.props.tabs && <TabBar tabs={this.props.tabs} />}
      </div>
    )
  }

}

TitleBar.propTypes = {
  picture: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  collapsed: PropTypes.bool,
  tabs: PropTypes.array,
  controls: PropTypes.array
}

export default TitleBar