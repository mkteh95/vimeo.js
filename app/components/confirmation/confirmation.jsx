import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'


class Confirmation extends React.Component {

  handleChange(e) {
    this.setState({
      message: e.target.value
    })
  }

  render() {
    return (
      <div className={style.confirmation}>
        <div>{this.props.message}</div>
        <div className={style.controls}>
          <button className={style.submit} onClick={this.props.onConfirm.bind(this)}>{this.props.confirmBtn}</button>
          <button onClick={this.props.onCancel.bind(this)}>Cancel</button>
        </div>
      </div>
    )
  }

}

Confirmation.propTypes = {
  message: PropTypes.string,
  confirmBtn: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}


export default Confirmation