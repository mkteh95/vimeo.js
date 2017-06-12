import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import style from './style.scss'


class Card extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded: 0
    }
  }

  handleLoaded() {
    this.setState({
      loaded: this.state.loaded + 1
    })
  }

  render() {
    return (
      <div className={(this.state.loaded === 1) ? style.card : style.loading}>
        <Link to={this.props.uri}>
          <div className={style.banner}>
            <img src={this.props.banner} onLoad={this.handleLoaded.bind(this)} />
          </div>
          <div className={style.content}>
            <span className="title">{this.props.title}</span>
            <span className="subtitle">{
              (this.props.followers) 
                ? `${this.props.videos} videos | ${this.props.followers} followers`
                : `${this.props.videos} videos`}
            </span>
            {this.props.description && <span className={style.description}>{this.props.description}</span>}
          </div>
        </Link>
      </div>
    )
  }

}

Card.propTypes = {
  banner: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.array,
  description: PropTypes.string,
  uri: PropTypes.string,
  onClick: PropTypes.func
}


export default Card