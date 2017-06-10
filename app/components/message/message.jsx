import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import CommentForm from '../commentForm/commentForm.jsx'
import Confirmation from '../confirmation/confirmation.jsx'

import style from './style.scss'


class Message extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      action: null
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.message !== nextProps.message) {
      this.setState({
        action: null
      })
    }
  }

  switchAction(action) {
    this.setState({
      action: action
    })
  }

  render() {
    return (
      <div className={(this.props.isReply) ? `${style.message} ${style.reply}` : style.message}>
        <span className={style.picture}>
          <Link to={this.props.user.uri}><img src={this.props.user.picture} /></Link>
        </span>
        <div className={style.content}>
          <div className={style.header}>
            <Link className={style.user} to={this.props.user.uri}>{this.props.user.name}</Link>
            <span className={style.time}>{this.props.time}</span>
            {this.props.isUser && 
              <div className={style.actions}>
                <span onClick={this.switchAction.bind(this, 'edit')}>Edit</span>
                <span onClick={this.switchAction.bind(this, 'delete')}>Delete</span>
              </div>
            }
          </div>
          {(this.state.action === 'edit') ? (
            <CommentForm submitBtn="Edit comment"
              initialMessage={this.props.message}
              onSubmit={this.props.onEdit.bind(this)}
              onCancel={this.switchAction.bind(this, null)} />
          ) : (
            <div className={style.text}>{this.props.message}</div>
          )}
          {this.state.action === 'delete' &&  
            <Confirmation message="Are you sure you want to delete this comment permanently?"
              confirmBtn="Delete comment"
              onConfirm={this.props.onDelete.bind(this)}
              onCancel={this.switchAction.bind(this, null)} />
          }
        </div>
      </div>
    )
  }

}

Message.propTypes = {
  user: PropTypes.shape({
    uri: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string
  }),
  time: PropTypes.string,
  message: PropTypes.string,
  isReply: PropTypes.bool,
  isUser: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}


export default Message