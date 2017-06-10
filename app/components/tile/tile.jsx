import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class Tile extends React.Component {

  render() {
    return (
      <div className={style.tile}>
        <Link to={this.props.uri}>
          <img className={style.bg} src={this.props.picture} />
          <div className={style.overlay}>
            <img className={style.icon} src={this.props.icon} />
            <span className={style.caption}>{this.props.caption}</span>
          </div>
        </Link>
      </div>
    )
  }

}

Tile.propTypes = {
  icon: PropTypes.string,
  picture: PropTypes.string,
  caption: PropTypes.string,
  uri: PropTypes.string
}

export default Tile