import React from 'react'

import ExceptionPage from '../../pages/exception/exception.jsx'

import style from './style.scss'


class MediumGrid extends React.Component {

  render() {
    return (Array.isArray(this.props.children))
      ? (this.props.children.length > 0)
        ? (
            <div className={style.mediumGrid}>
              {this.props.children}
            </div>
          )
        : (
             <ExceptionPage title="No content available." />
          )
      : null
  }

}


export default MediumGrid