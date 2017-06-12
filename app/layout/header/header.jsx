import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { remote } from 'electron'

import { logout } from '../../services/api.js'

import style from './style.scss'


class Header extends React.Component {

  constructor(props) {
    super(props)
    console.log(remote)

    this.state = {
      query: ''
    }
  }

  handleChange(e) {
    this.setState({ 
      query: e.target.value.trim()
    });
  }

  handleSearch(e) {
    if (e.charCode == 13 && e.target.value !== '') {
      this.props.history.push(`/search/${this.state.query}`)
    }
  }
  
  handleClear(e) {
    e.target.previousSibling.value = ''
    this.setState({
      query: ''
    })
  }

  handleLogout(e) {
    e.preventDefault()
    e.stopPropagation()

    const url = e.target.getAttribute('href')

    logout().then(() => {
      remote.session.defaultSession.clearStorageData({
        storages: ['localstorage', 'cookies']
      }, () => {
        this.props.history.push(url)
      })
    })
  }

  render() {
    return (
      <nav className={style.header}>
        <div className={style.navControls}>
          <a className={style.back} onClick={history.back}><i className="fa fa-angle-left fa-fw"></i></a>
          <a className={style.forward} onClick={history.forward}><i className="fa fa-angle-right fa-fw"></i></a>
        </div>
        <div className={style.searchBox}>
          <div className={style.search}>
            <i className="fa fa-search fa-fw"></i>
            <input type="text" placeholder="Search videos, users, and more" onChange={this.handleChange.bind(this)} 
              onKeyPress={this.handleSearch.bind(this)} required />
            <span className={style.closeBtn} onClick={this.handleClear.bind(this)}>&#10005;</span>
          </div>
        </div>
        <div className={style.extraControls}>
          <Link to={this.props.user.uri} className={style.user}>
            <img src={this.props.user.picture} /> {this.props.user.name}
          </Link>
          <span className={style.menu}>
            <div className={style.menuWrapper}>
              <Link to="/login" className={style.menuItem} onClick={this.handleLogout.bind(this)}>Logout</Link>
            </div>
          </span>
        </div>
      </nav>
    )
  }

}

Header.propTypes = {
  user: PropTypes.object
}

export default withRouter(Header)