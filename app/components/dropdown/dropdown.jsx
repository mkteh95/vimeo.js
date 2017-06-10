import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'


class Dropdown extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      selected: props.options[0]
    }
  }

  componentWillMount() {
    this.props.onChanged(this.state.selected)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options) || this.props.onChanged !== nextProps.onChanged) {
      this.setState({
        selected: nextProps.options[0]
      })

      nextProps.onChanged(nextProps.options[0])
    }
  }

  handleChange(option) {
    this.setState({
      selected: option,
      open: false
    })

    this.props.onChanged(option)
  }

  setVisibility(visibility) {
    this.setState({
      open: visibility
    })
  }

  render() {
    return (
      <div className={(this.state.open) ? `${style.dropdown} ${style.open}` : style.dropdown}>
        {this.props.label && <span className={style.label}>{this.props.label}</span>}
        <div className={style.dropdownWrapper} tabIndex="0" onBlur={this.setVisibility.bind(this, false)}>
          <div className={style.preview} onClick={this.setVisibility.bind(this, !this.state.open)}>
            <div className={style.display}>{this.state.selected.label}</div>
            <div className={style.indicator}></div>
          </div>
          <div className={style.options}>
            {
              this.props.options.map((option) => (
                <div className={(option.label === this.state.selected.label) ? `${style.item} ${style.active}` : style.item} 
                  onClick={this.handleChange.bind(this, option)} 
                  key={option.label}>{option.label}</div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })).isRequired,
  label: PropTypes.string,
  onChanged: PropTypes.func.isRequired
}


export default Dropdown