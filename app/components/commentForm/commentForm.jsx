import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'


class CommentForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      message: props.initialMessage
    }
  }

  handleChange(e) {
    this.setState({
      message: e.target.value.trim()
    })
  }

  render() {
    return (
      <div className={style.commentForm}>
        <textarea placeholder={this.props.placeholder} onChange={this.handleChange.bind(this)} required>{this.props.initialMessage}</textarea>
        <div className={style.controls}>
          <button className={style.submit} onClick={this.props.onSubmit.bind(this, this.state.message)}>{this.props.submitBtn}</button>
          {this.props.onCancel && <button onClick={this.props.onCancel.bind(this)}>Cancel</button>}
        </div>
      </div>
    )
  }

}

CommentForm.propTypes = {
  initialMessage: PropTypes.string,
  placeholder: PropTypes.string,
  submitBtn: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}


export default CommentForm