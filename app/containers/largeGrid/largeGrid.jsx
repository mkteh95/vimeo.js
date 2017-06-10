import React from 'react'

import style from './style.scss'


class LargeGrid extends React.Component {

  render() {
    return (
      <div className={style.largeGrid}>
        {this.props.children}
      </div>
    )
  }

}


export default LargeGrid