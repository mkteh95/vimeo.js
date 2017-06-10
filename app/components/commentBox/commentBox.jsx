import React from 'react'
import PropTypes from 'prop-types'

import { getComments, postComment, deleteComment, editComment } from '../../services/api.js'

import LoadContainer from '../../containers/loadContainer/loadContainer.jsx'
import Comment from '../comment/comment.jsx'
import CommentForm from '../commentForm/commentForm.jsx'

import style from './style.scss'


class CommentBox extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      comments: [],
      nextPage: null
    }
  }

  componentWillMount() {
    if (this.props.comments.total !== '0') {
      this.setState({
        nextPage: 1
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.comments.uri !== nextProps.comments.uri) {
      this.setState({
        comments: [],
        nextPage: (nextProps.comments.total !== '0') ? 1 : null
      })
    }
  }

  fetchComments(page) {
    getComments(this.props.comments.uri, { page: page, per_page: 10 }).then((response) => {
      this.setState({
        comments: [...this.state.comments, ...response.comments],
        nextPage: response.paging.next
      })
    })
  }
  
  publishComment(endpoint, comment) {
    postComment(endpoint, { text: comment }).then((response) => {
      this.setState({
        comments: [response, ...this.state.comments]
      })
    })
  }
  
  updateComment(endpoint, editedComment) {
    editComment(endpoint, {text: editedComment}).then(() => {
      this.setState({
        comments: this.state.comments.map((comment) => {
          return (comment.uri === endpoint) ? { ...comment, message: editedComment }: comment
        })
      })
    })
  }
  
  removeComment(endpoint) {
    deleteComment(endpoint).then(() => {
      this.setState({
        comments: this.state.comments.filter((comment) => {
          return comment.uri !== endpoint
        })
      })
    })
  }
  
  handleChange(e) {
    this.setState({ 
      newComment: e.target.value.trim()
    });
  }

  render() {
    const currUser = JSON.parse(localStorage.getItem('user'))

    return (
      <div>
        <LoadContainer nextPage={this.state.nextPage} onLoad={this.fetchComments.bind(this)} reversed={true} caption="Load more comments...">
          {
            this.state.comments.map((comment) => (
              <Comment user={comment.user}
                time={comment.time}
                message={comment.message}
                replies={comment.replies}
                uri={comment.uri}
                onReply={this.publishComment.bind(this, comment.replies.uri)}
                onDelete={this.removeComment.bind(this, comment.uri)}
                onEdit={this.updateComment.bind(this, comment.uri)}
                key={comment.uri} />
            ))
          }
        </LoadContainer>
        <div className={style.commentForm}>
          <span className={style.picture}>
            <img src={currUser.picture} />
          </span>
          <div className={style.content}>
            <CommentForm placeholder="Add a comment"
              submitBtn="Add comment"
              onSubmit={this.publishComment.bind(this, this.props.comments.uri)} />
          </div>
        </div>
      </div>
    )
  }

}

CommentBox.propTypes = {
  comments: PropTypes.shape({
    uri: PropTypes.string,
    total: PropTypes.string
  })
}


export default CommentBox