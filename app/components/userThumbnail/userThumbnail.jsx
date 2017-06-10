import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class UserThumbnail extends React.Component {

  render() {
    return (
      <div className={style.userThumbnail}>
        <Link to={this.props.uri}>
          <img src={this.props.picture} />
        </Link>
        <div className={style.details}>
          <Link to={this.props.uri}>
            <span className="title">{this.props.title}</span>
          </Link>
          <span className="subtitle">{`${this.props.videos} videos | ${this.props.followers} followers`}</span>
          <div className={style.controls}>
            {this.props.buttons}
          </div>
        </div>
      </div>
    )
  }

}

UserThumbnail.propTypes = {
  picture: PropTypes.string,
  title: PropTypes.string,
  followers: PropTypes.string,
  videos: PropTypes.string,
  uri: PropTypes.string,
}


export default UserThumbnail