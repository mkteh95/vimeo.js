import React from 'react'
import PropTypes from 'prop-types'

import Spinner from '../../components/spinner/spinner.jsx'


class LazyContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      fetching: false
    }

    this.handleLazy = this.lazyHandler.bind(this)
  }

  lazyCall(props) {
    props.onLazy(props.nextPage)
    this.setState({ fetching: true })
  }

  lazyHandler() {
    if (!this.state.fetching) {
      const scrollTop = this.refs.lazy.scrollTop
      const scrollHeight = this.refs.lazy.scrollHeight
      const offsetHeight = this.refs.lazy.offsetHeight

      if (scrollHeight - offsetHeight <= scrollTop) {
        this.lazyCall(this.props)
      }
    }
  }

  componentWillMount() {
    if (this.props.nextPage !== null) {
      this.lazyCall(this.props)
    }
  }

  componentDidMount() {
    if (this.props.nextPage !== null) {
      this.refs.lazy.addEventListener('scroll', this.handleLazy)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nextPage !== nextProps.nextPage) {
      if (this.props.nextPage === null) {
        this.refs.lazy.addEventListener('scroll', this.handleLazy)
      }

      if (nextProps.nextPage === 1) {
        this.lazyCall(nextProps)
      } else {
        if (nextProps.nextPage === null) {
          this.refs.lazy.removeEventListener('scroll', this.handleLazy)
        }
        this.setState({ fetching: false })
      }
    } else if (this.props.onLazy !== nextProps.onLazy && nextProps.nextPage === 1) {
      this.lazyCall(nextProps)
    }
  }

  componentWillUnmount() {
    if (this.props.nextPage !== null) {
      this.refs.lazy.removeEventListener('scroll', this.lazyHandler.bind(this))
    }
  }

  render() {
    return (
      <div ref="lazy">
        {this.props.children}
        {this.state.fetching && <Spinner />}
      </div>
    )
  }

}

LazyContainer.propTypes = {
  nextPage: PropTypes.number,
  onLazy: PropTypes.func.isRequired
}

export default LazyContainer