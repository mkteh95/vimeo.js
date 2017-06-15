import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class Tile extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded: 0
    }

    if (!this.props.picture) {
      this.state.loaded += 1
    }
    if (!this.props.icon) {
      this.state.loaded += 1
    }
  }

  handleLoaded() {
    this.setState({
      loaded: this.state.loaded + 1
    })
  }

  render() {
    return (
      <div className={(this.state.loaded === 2) ? style.tile : style.loading}>
        <div className={style.tileWrapper}>
          <Link to={this.props.uri}>
            <img className={style.bg} src={this.props.picture} onLoad={this.handleLoaded.bind(this)} />
            <div className={style.overlay}>
              <img className={style.icon} src={this.props.icon} onLoad={this.handleLoaded.bind(this)} />
              <span className={style.caption}>{this.props.caption}</span>
            </div>
          </Link>
        </div>
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