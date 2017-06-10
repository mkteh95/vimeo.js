import React from 'react'
import PropTypes from 'prop-types'

import TitleBar from '../../components/titleBar/titleBar.jsx'

import style from './style.scss'


class CollapsibleTitleBar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      collapsed: false
    }

    this.handleCollapse = this.collapseHandler.bind(this)
  }

  collapseHandler() {
    const scrollTop = this.refs.titlebar.parentNode.scrollTop
    const titlebarHeight = this.refs.titlebar.offsetHeight
    const offset = (this.props.tabs) ? 100 : 50

    if (scrollTop > titlebarHeight - offset) {
      if (!this.state.collapsed) {
        this.setState({
          collapsed: true
        })
      }
    } else if (this.state.collapsed) {
      this.setState({
        collapsed: false
      })
    }
  }

  componentDidMount() {
    this.refs.titlebar.parentNode.addEventListener('scroll', this.handleCollapse)
  }

  componentWillUnmount(nextProps) {
    this.refs.titlebar.parentNode.removeEventListener('scroll', this.handleCollapse)
  }

  render() {
    return (
      <div className={(this.props.tabs) ? style.collapsibleTitleBarWithTabs : style.collapsibleTitleBar} ref="titlebar">
        <TitleBar collapsed={this.state.collapsed} 
          picture={this.props.picture}
          title={this.props.title}
          description={this.props.description}
          label={this.props.label}
          tabs={this.props.tabs}
          controls={this.props.controls} />
      </div>
    )
  }

}

CollapsibleTitleBar.propTypes = {
  picture: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  controls: PropTypes.array,
  tabs: PropTypes.array
}

export default CollapsibleTitleBar