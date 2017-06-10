import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getComments } from '../../services/api.js'

import LoadContainer from '../../containers/loadContainer/loadContainer.jsx'
import CommentForm from '../commentForm/commentForm.jsx'
import Confirmation from '../confirmation/confirmation.jsx'
import Message from '../message/message.jsx'

import style from './style.scss'


class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      action: null,
      replies: [],
      nextPage: null
    }
  }

  componentWillMount() {
    if (this.props.replies && this.props.replies.total > 0) {
      this.setState({
        nextPage: 1
      })
    }
  }

  fetchReplies(page) {
    getComments(this.props.replies.uri, { page: page, per_page: (page === 1) ? 2 : 10 }).then((response) => {
      this.setState({
        replies: [...this.state.replies, ...response.comments],
        nextPage: response.paging.next
      })
    })
  }
  
  switchAction(type) {
    this.setState({
      action: type
    })
  }

  render() {
    const currUser = JSON.parse(localStorage.getItem('user'))

    return (
      <div className={style.comment}>
        <Message user={this.props.user}
          time={this.props.time}
          message={this.props.message}
          isReply={false}
          isUser={currUser.uri === this.props.user.uri}
          onDelete={this.props.onDelete.bind(this)}
          onEdit={this.props.onEdit.bind(this)} />
        <LoadContainer nextPage={this.state.nextPage} onLoad={this.fetchReplies.bind(this)} reversed={true} caption="Load more replies...">
          {
            this.state.replies.map((reply) => (
              <Message user={reply.user}
                time={reply.time}
                message={reply.message}
                isReply={true}
                isUser={currUser.uri === reply.user.uri}
                onDelete={this.props.onDelete.bind(this)}
                onEdit={this.props.onEdit.bind(this)}
                key={reply.uri} />
            ))
          }
        </LoadContainer>
        <div className={style.reply}> 
          {this.state.action === 'reply' &&
            <CommentForm placeholder="Reply to this comment"
              submitBtn="Reply comment"
              onSubmit={this.props.onReply.bind(this)}
              onCancel={this.switchAction.bind(this, null)} />
          } 
          <div className={style.actions}>
            <span onClick={this.switchAction.bind(this, 'reply')}>Reply</span>
          </div>
        </div>
      </div>
    )
  }

}

Comment.propTypes = {
  uri: PropTypes.string,
  user: PropTypes.shape({
    uri: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string
  }),
  time: PropTypes.string,
  message: PropTypes.string,
  replies: PropTypes.shape({
    uri: PropTypes.string,
    total: PropTypes.number
  }),
  onDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}


export default Comment