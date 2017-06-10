import React from 'react'

import style from './style.scss'


class SmallGrid extends React.Component {

  render() {
    return (
      <div className={style.smallGrid}>
        {this.props.children}
      </div>
    )
  }

}


export default SmallGrid