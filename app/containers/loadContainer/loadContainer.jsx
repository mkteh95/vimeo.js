import React from 'react'
import PropTypes from 'prop-types'

import Spinner from '../../components/spinner/spinner.jsx'

import style from './style.scss'


class LoadContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      fetching: false
    }
  }

  loadCall(props) {
    props.onLoad(props.nextPage)
    this.setState({ fetching: true })
  }

  componentWillMount() {
    if (this.props.nextPage !== null) {
      this.loadCall(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nextPage !== nextProps.nextPage) {
      if (nextProps.nextPage === 1) {
        this.loadCall(nextProps)
      } else {
        this.setState({ fetching: false })
      }
    } else if (this.props.onLoad !== nextProps.onLoad && nextProps.nextPage === 1) {
      this.loadCall(nextProps)
    }
  }

  render() {
    return (
      <div className={(this.props.reversed) ? `${style.loadContainer} ${style.reversed}` : style.loadContainer}>
        {this.props.children}
        {!this.state.fetching && this.props.nextPage !== null && <div className={style.toggler}>
          <button onClick={this.loadCall.bind(this, this.props)}>{this.props.caption || 'Show more...'}</button>
        </div>}
        {this.state.fetching && <Spinner />}
      </div>
    )
  }

}

LoadContainer.propTypes = {
  nextPage: PropTypes.number,
  onLoad: PropTypes.func.isRequired,
  reversed: PropTypes.bool,
  caption: PropTypes.string
}

export default LoadContainer