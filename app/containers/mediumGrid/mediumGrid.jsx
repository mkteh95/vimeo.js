import React from 'react'

import style from './style.scss'


class MediumGrid extends React.Component {

  render() {
    return (
      <div className={style.mediumGrid}>
        {this.props.children}
      </div>
    )
  }

}


export default MediumGrid