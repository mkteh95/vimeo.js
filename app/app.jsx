import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Sidebar from './layout/sidebar/sidebar.jsx'
import Content from './layout/content/content.jsx'
import LoginPage from './pages/login/login.jsx'

import 'font-awesome/scss/font-awesome.scss'
import style from './style.scss'


class Application extends React.Component {

  render() {
    return (
      <Switch>
        {location.pathname.endsWith('index.html') && <Redirect to="/" />}
        <Route path="/login" component={LoginPage} />
        <Route path="/" render={() => (localStorage.getItem('accessToken') === null)
          ? (<Redirect to="/login" />)
          : (
            <div className={style.appWrapper}>
              <Sidebar />
              <Content />
            </div>
          )} />
      </Switch>
    )
  }

}

ReactDOM.render((
  <BrowserRouter>
    <Application />
  </BrowserRouter>
), document.getElementById('app-container'))