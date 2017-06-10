import React from 'react'
import PropTypes from 'prop-types'

import { checkSubscription, subscribe, unsubscribe } from '../../services/api.js'

import style from './style.scss'


class FollowButton extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      following: null
    }
  }

  componentWillMount() {
    checkSubscription(this.props.uri).then((response) => {
      this.setState({
        following: response
      })
    })
  }
  
  handleFollow() {
    if (this.state.following) {
      unsubscribe(this.props.uri).then((response) => {
        this.setState({
          following: false
        })
      })
    } else {
      subscribe(this.props.uri).then((response) => {
        this.setState({
          following: true
        })
      })
    }
  }

  render() {
    return (this.state.following !== null) 
             ? (<button className={(this.state.following) ? style.unfollowButton : style.followButton} onClick={this.handleFollow.bind(this)}></button>)
             : null
  }

}

FollowButton.propTypes = {
  uri: PropTypes.string
}


export default FollowButton