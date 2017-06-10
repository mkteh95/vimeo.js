import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'


class HideContent extends React.Component {

  render() {
    return (
      <div className={(this.props.hidden) ? style.hidden : ''}>
        {this.props.children}
      </div>
    )
  }

}

HideContent.propTypes = {
  hidden: PropTypes.bool
}


export default HideContent