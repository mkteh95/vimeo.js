import React from 'react'
import { Link } from 'react-router-dom'

import { getVideo } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CommentBox from '../../components/commentBox/commentBox.jsx'
import RelatedVideos from '../../components/relatedVideos/relatedVideos.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'
import ShareDialog from '../../components/shareDialog/shareDialog.jsx'

import Player from '@vimeo/player'

import style from './style.scss'


class VideoPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      video: {},
      descriptionCollapsed: false
    }
  }

  componentWillMount() {
    this.fetchVideo(this.props.match.url)
  }

  componentDidMount() {
    this.player = new Player(this.refs.player, {
      id: this.props.match.params.video,
      height: '540px',
      width: '960px'
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.video !== nextProps.match.params.video) {
      this.player.loadVideo(nextProps.match.params.video).then(function(id) {
          // the video successfully loaded
      }).catch(function(error) {
        switch (error.name) {
          case 'TypeError':
            // the id was not a number
            break;

          case 'PasswordError':
            // the video is password-protected and the viewer needs to enter the
            // password first
            break;

          case 'PrivacyError':
            // the video is password-protected or private
            break;

          default:
            // some other error occurred
            break;
        }
      });

      this.fetchVideo(nextProps.match.url)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.video.description !== this.state.video.description && this.refs.description.offsetHeight > 250) {
      this.setState({
        descriptionCollapsed: true
      })
    }
  }

  fetchVideo(endpoint) {
    getVideo(endpoint).then((response) => {
      this.setState({
        initialized: true,
        video: response
      })
    })
  }

  expandDescription() {
    this.setState({
      descriptionCollapsed: false
    })
  }

  toggleShare() {
    this.setState({
      sharing: !this.state.sharing
    })
  }

  render() {
    return (
      <div className={style.videoPage}>
        <div className={style.player}>
          <div className={style.playerContainer}>
            <div className={style.playerWrapper} ref="player"></div>
          </div>
        </div>
        {this.state.initialized &&
          <div className={style.contentWrapper}>
            <div className={style.content}>
              <div className={style.details}>
                <h1>{this.state.video.name}</h1>
                <Link className={style.user} to={this.state.video.user.uri}>
                  <img src={this.state.video.user.picture} />
                  <h3 className={style.name}>{this.state.video.user.name}</h3>
                </Link>
                <FollowButton uri={`/me/following/${this.state.video.user.uri.split('/').pop()}`} />
              </div>
              <div className={(this.state.descriptionCollapsed) ? `${style.description} ${style.collapsed}` : style.description} 
                ref="description">
                <header>
                  <div className={style.stats}>
                    <div><i className="fa fa-play fa-fw"></i> {this.state.video.plays}</div>
                    <div><i className="fa fa-heart fa-fw"></i> {this.state.video.likes}</div>
                    <div><i className="fa fa-comment fa-fw"></i> {this.state.video.comments.total}</div>
                  </div>
                  <div className={style.controls}>
                    <button onClick={this.toggleShare.bind(this)}><i className="fa fa-send fa-fw"></i> Share</button>
                  </div>
                </header>
                <div className={style.text}>{this.state.video.description}</div>
                {this.state.descriptionCollapsed &&
                  <div className={style.toggler}>
                    <button onClick={this.expandDescription.bind(this)}>Read More...</button>
                  </div>
                }
              </div>
              {this.state.video.tags.length > 0 &&
                <div className={style.tags}>
                  <h2>Tags</h2>
                  <div className={style.tagList}>
                    {
                      this.state.video.tags.map((tag) => (
                        <Link to={tag.uri} key={tag.uri}>{tag.name}</Link>
                      ))
                    }
                  </div>
                </div>
              }
              <div className={style.comments}>
                <h2>Comments</h2>
                <CommentBox comments={this.state.video.comments} />
              </div>
            </div>
            <div className={style.related}>
              <h2>Related Videos</h2>
              <RelatedVideos uri={`${this.props.match.url}/videos`} />
            </div>
          </div>
        }
        {this.state.sharing && <ShareDialog link={this.state.video.link} onToggle={this.toggleShare.bind(this)} />}
      </div>
    )
  }

}


export default VideoPage