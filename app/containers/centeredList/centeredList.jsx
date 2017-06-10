import React from 'react'

import style from './style.scss'


class CenteredList extends React.Component {

  render() {
    return (
      <div className={style.centeredList}>
        {this.props.children}
      </div>
    )
  }

}


export default CenteredList