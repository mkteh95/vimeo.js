import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { subscribe, unsubscribe } from '../../services/api.js'

import style from './style.scss'


class Preview extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      watchLater: props.watchLater,
      loaded: 0
    }
  }
  
  updateWatchLater(e) {
    e.preventDefault()
    e.stopPropagation()

    const subscriptionFunc = (this.state.watchLater) ? unsubscribe : subscribe

    subscriptionFunc(`/me/watchlater/${this.props.uri.split('/').pop()}`).then(() => {
      this.setState({
        watchLater: !this.state.watchLater
      })

      if (this.props.onUnwatchLater) {
        this.props.onUnwatchLater(this.props.uri)
      }
    })
  }

  handleLoaded() {
    this.setState({
      loaded: this.state.loaded + 1
    })
  }
  
  render() {
    return (
      <div className={(this.state.loaded === 2) ? style.preview : style.loading}>
        <div className={style.content}>
          <Link to={this.props.uri}>
            <div className={style.picture}>
              <img src={this.props.picture} onLoad={this.handleLoaded.bind(this)} />
              <div className={style.overlay}>
                <span className={style.play}><i className="fa fa-play fa-2x fa-fw"></i></span>
                <span className={(this.state.watchLater) ? `${style.watchlater} ${style.active}` : style.watchlater}
                  onClick={this.updateWatchLater.bind(this)}><i className="fa fa-clock-o fa-fw"></i></span>
                <span className={style.duration}>{this.props.duration}</span>
              </div>
            </div>
            <div className={style.title}>
              <span className="title">{this.props.title}</span>
            </div>
          </Link>
        </div>
        <div className={style.details}>
          <div className="subtitle">
            <i className="fa fa-play fa-fw"></i> {this.props.plays} |&nbsp;
            <i className="fa fa-heart fa-fw"></i> {this.props.likes} |&nbsp;
            <i className="fa fa-comment fa-fw"></i> {this.props.comments}
          </div>
          <div className={style.user}>
            <Link to={this.props.user.uri}>
              <img src={this.props.user.picture} onLoad={this.handleLoaded.bind(this)} />
              <span className={style.name}>{this.props.user.name}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

}

Preview.propTypes = {
  plays: PropTypes.string,
  likes: PropTypes.string,
  comments: PropTypes.string,
  picture: PropTypes.string,
  title: PropTypes.string,
  uri: PropTypes.string,
  duration: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
    uri: PropTypes.string
  }),
  watchLater: PropTypes.bool,
  onUnwatchLater: PropTypes.func
}

Preview.defaultProps = {
  watchLater: false
}

export default Preview