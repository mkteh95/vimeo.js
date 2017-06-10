import React from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { login } from '../../services/api.js'

import style from './style.scss'


class LoginPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      authenticated: false
    }

    this.loginHandler = (e) => {
      const currUrl = new URL(e.target.getURL())

      if (currUrl.href.startsWith('http://127.0.0.1/mteh.vimeo.js')) {
        login(currUrl.searchParams.get('code'), this.authHeader, this.redirectUrl).then(() => {
          this.setState({ authenticated: true })
        })
      }
    }

    const clientSecret = 'I0D5JrHsNdBk0xdyu9zXG/Y3TVdd8/Z8IijOWqfQ7jupIy5zgzthWsFhLFRkr1igkX4T2/ZpXcbYGU4Tu294dxXOYk45hTLISRKN+ysb9OmE1fcDWTbISShsBr+B22BR'
    const clientId = '9bb54648addc57804fc4bca391a84c12a7ed8e8d'
    const state = 'f68d84f4b3161a9fc735118a1f20106009719df2'
    const scope = "public private interact delete edit"

    this.redirectUrl = 'http://127.0.0.1/mteh.vimeo.js'
    this.endpoint = `https://api.vimeo.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${this.redirectUrl}&state=${state}&scope=${scope}`

    this.authHeader = {'Authorization': `basic ${btoa(`${clientId}:${clientSecret}`)}`}
  }

  componentDidMount() {
    this.refs.webview.addEventListener('did-finish-load', this.loginHandler)
  }

  componentWillUnmount() {
    if (this.refs.webview) {
      this.refs.webview.removeEventListener('did-finish-load', this.loginHandler)
    }
  }

  render() {
    return (
      <div className={style.loginPage}>
        {this.state.authenticated && <Redirect to="/categories" />}
        <webview src={this.endpoint} ref="webview"></webview>
      </div>
    )
  }

}

export default LoginPage