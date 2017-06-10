import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class VideoThumbnail extends React.Component {

  navigateToUser(e) {
    e.preventDefault()
    e.stopPropagation()
    
    this.props.history.push(this.props.user.uri);
  }
  
  render() {
    return (
      <div className={style.videoThumbnail}>
        <Link to={this.props.uri}>
          <div className={style.picture}>
            <img src={this.props.picture} />
            <div className={style.overlay}>
              <span className={style.play}><i className="fa fa-play fa-fw"></i></span>
              <span className={style.watchlater} onClick={this.navigateToUser.bind(this)}><i className="fa fa-clock-o fa-fw"></i></span>
              <span className={style.duration}>{this.props.duration}</span>
            </div>
          </div>
          <div className={style.description}>
           <span className={style.user} onClick={(e) => {}}>
              <img src={this.props.user.picture} />
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

VideoThumbnail.propTypes = {
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
  uri: PropTypes.string,
}


export default withRouter(VideoThumbnail)