import React from 'react'
import PropTypes from 'prop-types'

import style from './style.css'


class Section extends React.Component {

  render() {
    return (
      <div className={style.section}>
          <h3 className="title">{this.props.title}</h3>
          {this.props.children}
      </div>
    )
  }

}

Section.propTypes = {
  title: PropTypes.string
}


export default Section