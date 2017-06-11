import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from '../dropdown/dropdown.jsx'

import style from './style.scss'


class Filter extends React.Component {

  getFilters(type) {
    switch(type) {
      case 'channels':
      case 'groups':
        return [{ 
          label: 'Featured', 
          value: { filter: 'featured' } 
        }, {
          label: 'Popularity',
          value: { sort: 'followers' }
        }, {
          label: 'Recently updated',
          value: { sort: 'date' }
        }, {
          label: 'Name (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Name (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }]

      case 'users':
        return [{ 
          label: 'Relevance', 
          value: { sort: 'relevant' } 
        }, {
          label: 'Recently joined',
          value: { sort: 'date' }
        }, {
          label: 'Name (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Name (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }]

      case 'videos':
        return [{ 
          label: 'Relevance', 
          value: { sort: 'relevant' } 
        }, {
          label: 'Popularity',
          value: { sort: 'plays' }
        }, {
          label: 'Recently uploaded',
          value: { sort: 'date' }
        }, {
          label: 'Title (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Title (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }, {
          label: 'Longest',
          value: { sort: 'duration', direction: 'desc' }
        }, {
          label: 'Shortest',
          value: { sort: 'duration' }
        }]

      case 'uploads':
        return [{
          label: 'Popularity',
          value: { sort: 'plays' }
        }, {
          label: 'Recently uploaded',
          value: { sort: 'date' }
        }, {
          label: 'Title (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Title (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }, {
          label: 'Longest',
          value: { sort: 'duration', direction: 'desc' }
        }, {
          label: 'Shortest',
          value: { sort: 'duration' }
        }]

      case 'likes':
      case 'watchlater':
        return [{
          label: 'Popularity',
          value: { sort: 'plays' }
        }, {
          label: 'Recently uploaded',
          value: { sort: 'date' }
        }, {
          label: 'Title (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Title (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }, {
          label: 'Longest',
          value: { sort: 'duration', direction: 'desc' }
        }, {
          label: 'Shortest',
          value: { sort: 'duration' }
        }]

      case 'feed':
        return [{
          label: 'Recently uploaded',
          value: { sort: 'date' }
        }]

      case 'portfolios':
        return [{
          label: 'Recently created',
          value: { sort: 'date' }
        }, {
          label: 'Title (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Title (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }]

      case 'albums':
        return [{
          label: 'Recently created',
          value: { sort: 'date' }
        }, {
          label: 'Title (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Title (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }, {
          label: 'Longest',
          value: { sort: 'duration', direction: 'desc' }
        }, {
          label: 'Shortest',
          value: { sort: 'duration' }
        }]

      case 'followers':
      case 'following':
        return [{
          label: 'Recently followed',
          value: { sort: 'date' }
        }, {
          label: 'Name (A-Z)',
          value: { sort: 'alphabetical' }
        }, {
          label: 'Name (Z-A)',
          value: { sort: 'alphabetical', direction: 'desc' }
        }]
    }
  }

  render() {
    return (
      <div className={style.filter}>
        <Dropdown options={this.getFilters(this.props.type)}
          label="Sort by:"
          onChanged={this.props.onChanged} />
      </div>
    )
  }

}

Filter.propTypes = {
  type: PropTypes.string,
  onChanged: PropTypes.func.isRequired
}


export default Filter