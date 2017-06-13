import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { subscribe, unsubscribe } from '../../services/api.js'

import style from './style.scss'


class LandscapePreview extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = {
      watchLater: props.watchLater,
      loaded: 0
    }

    if (!this.props.picture) {
      this.state.loaded += 1
    }
    if (!this.props.user.picture) {
      this.state.loaded += 1
    }
  }

  navigateToUser(uri, e) {
    e.preventDefault()
    e.stopPropagation()

    this.props.history.push(uri)
  }

  updateWatchLater(e) {
    e.preventDefault()
    e.stopPropagation()

    const subscriptionFunc = (this.state.watchLater) ? unsubscribe : subscribe

    subscriptionFunc(`/me/watchlater/${this.props.uri.split('/').pop()}`).then(() => {
      this.setState({
        watchLater: !this.state.watchLater
      })
    })
  }

  handleLoaded() {
    this.setState({
      loaded: this.state.loaded + 1
    })
  }
  
  render() {
    return (
      <div className={(this.state.loaded === 2) ? style.landscapePreview : style.loading}>
        <Link to={this.props.uri}>
          <div className={style.picture}>
            <img src={this.props.picture} onLoad={this.handleLoaded.bind(this)} />
            <div className={style.overlay}>
              <span className={style.play}><i className="fa fa-play fa-fw"></i></span>
              <span className={(this.state.watchLater) ? `${style.watchlater} ${style.active}` : style.watchlater}
                onClick={this.updateWatchLater.bind(this)}><i className="fa fa-clock-o fa-fw"></i></span>
              <span className={style.duration}>{this.props.duration}</span>
            </div>
          </div>
          <div className={style.description}>
            <span className={style.user} onClick={this.navigateToUser.bind(this, this.props.user.uri)}>
              <img src={this.props.user.picture} onLoad={this.handleLoaded.bind(this)} />
              <span className={style.name}>{this.props.user.name}</span>
            </span>
            <div className="subtitle">
              <i className="fa fa-play fa-fw"></i> {this.props.plays} |&nbsp;
              <i className="fa fa-heart fa-fw"></i> {this.props.likes} |&nbsp;
              <i className="fa fa-comment fa-fw"></i> {this.props.comments}
            </div>
            <div className={style.title}>
              <span className="title">{this.props.title}</span>
            </div>
          </div>
        </Link>
      </div>
    )
  }

}

LandscapePreview.propTypes = {
  duration: PropTypes.string,
  plays: PropTypes.string,
  likes: PropTypes.string,
  comments: PropTypes.string,
  picture: PropTypes.string,
  title: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
    uri: PropTypes.string
  }),
  watchLater: PropTypes.bool,
  uri: PropTypes.string,
}

LandscapePreview.defaultProps = {
  watchLater: false
}


export default withRouter(LandscapePreview)