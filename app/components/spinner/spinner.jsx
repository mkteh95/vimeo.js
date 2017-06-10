import React from 'react'

import style from './style.scss'


class Spinner extends React.Component {

  render() {
    return (
      <div className={style.loading}>
        <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
      </div>
    )
  }

}

export default Spinner