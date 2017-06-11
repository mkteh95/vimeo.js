import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'


class ExceptionPage extends React.Component {

  render() {
    return (
      <div className={style.exceptionPage}>
        <h1>{this.props.title}</h1>
        <span>{this.props.subtitle}</span>
      </div>
    )
  }

}

ExceptionPage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
}


export default ExceptionPage