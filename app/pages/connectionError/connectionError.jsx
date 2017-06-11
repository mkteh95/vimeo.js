import React from 'react'

import style from './style.scss'


class ConnectionErrorPage extends React.Component {

  render() {

    return (
      <div className={style.connectionErrorPage}>
        <h1>You are not online!</h1>
        <span>Vimeo.js will reconnect when there is an active Internet connection.</span>
      </div>
    )
  }

}


export default ConnectionErrorPage