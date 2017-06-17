import React from 'react'
import PropTypes from 'prop-types'
import { shell, clipboard } from 'electron'

import style from './style.scss'


class ShareDialog extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      copied: false
    }
  }

  share(e) {
    e.preventDefault()
    e.stopPropagation()

    shell.openExternal(e.currentTarget.getAttribute('href'))
  }

  closeDialog(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.target === e.currentTarget) {
      this.props.onToggle()
    }
  }

  copyToClipboard(e) {
    e.preventDefault()
    e.stopPropagation()

    clipboard.writeText(e.currentTarget.getAttribute('href'))

    this.setState({
      copied: true
    })
  }

  render() {
    return (
      <div className={style.shareDialog} onClick={this.closeDialog.bind(this)}>
        <div className={style.dialog}>
          <h2>Share to:</h2>
          <div className={style.buttons}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${this.props.link}`} onClick={this.share.bind(this)}>
              <img src="https://en.facebookbrand.com/wp-content/uploads/2016/05/FB-fLogo-Blue-broadcast-2.png" alt="Share on Facebook"/>
            </a>
            <a href={`https://twitter.com/home?status=${this.props.link}`} onClick={this.share.bind(this)}>
              <img src="http://www.freeiconspng.com/uploads/twitter-icon--basic-round-social-iconset--s-icons-0.png" alt="Share on Twitter"/>
            </a>    
            <a href={`https://plus.google.com/share?url=${this.props.link}`} onClick={this.share.bind(this)}>
              <img src="https://www.gstatic.com/images/icons/gplus-64.png" alt="Share on Google+"/>
            </a>
            <a className={(this.state.copied) ? style.disabled : ''} href={this.props.link} onClick={this.copyToClipboard.bind(this)}>
              <i className="fa fa-fw fa-clipboard"></i>
            </a>
          </div>
        </div>
      </div>
    )
  }

}

ShareDialog.propTypes = {
  link: PropTypes.string,
  onToggle: PropTypes.func
}


export default ShareDialog