import React from 'react'

import { getCategory, getVideos, subscribe } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'
import Filter from '../../components/filter/filter.jsx'


class SubcategoriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
      followed: false,
      category: {
        subcategories: [{
          uri: `/categories/${props.match.params.category}/subcategories/featured/videos`,
          name: 'Featured'
        }]
      },
      subcategories: new Map([
        [`/categories/${props.match.params.category}/subcategories/featured/videos`, {
          videos: new Map()
        }]
      ]),
      filter: null
    }

    this.handleFitler = this.changeFilter.bind(this)
    this.retrieveVideos = this.fetchVideos.bind(this)
  }

  componentWillMount() {
    getCategory(`/categories/${this.props.match.params.category}`).then((response) => {
      for (let subcategory of response.subcategories) {
        this.state.subcategories.set(subcategory.uri, {
          videos: new Map()
        })
      }

      this.setState({
        initialized: true,
        category: {
          ...response,
          subcategories: [...this.state.category.subcategories, ...response.subcategories]
        },
        subcategories: this.state.subcategories
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.subcategory !== nextProps.match.params.subcategory) {
      this.setState({
        filter: null
      })

      this.retrieveVideos = this.fetchVideos.bind(this)
      this.handleFitler = this.changeFilter.bind(this)
    }
  }
  
  followCategory() {
    subscribe(`/me/categories/${this.props.match.params.category}`).then(() => {
      this.setState({
        followed: true
      })
    })
  }
  
  fetchVideos(page) {
    const endpoint = (this.props.match.params.subcategory === 'featured') 
                       ? `/categories/${this.props.match.params.category}/videos?sort=featured` 
                       : this.props.match.url
    
    getVideos(endpoint, { page: page, ...this.state.filter }).then((response) => {
      const curr = this.state.subcategories.get(this.props.match.url).videos.get(this.state.filter)

      this.state.subcategories.get(this.props.match.url).videos.set(this.state.filter, {
        videos: (curr.videos) ? [...curr.videos, ...response.videos] : response.videos,
        nextPage: response.paging.next
      })

      this.setState({
        subcategories: this.state.subcategories
      })
    })
  }

  changeFilter(selected) {
    if (this.state.subcategories.get(this.props.match.url).videos.has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state.subcategories.get(this.props.match.url).videos.set(selected.value, {
        videos: null,
        nextPage: 1
      })

      this.setState({
        subcategory: this.state.subcategories,
        filter: selected.value
      })
    }
  }

  render() {
    const url = this.props.match.url
    const tabs = this.state.category.subcategories.map((subcategory) => {
      return { path: subcategory.uri, label: subcategory.name }
    })
    
    const followEndpoint = `/me/categories/${this.props.match.params.category}`
    const controls = [<FollowButton uri={followEndpoint} key={followEndpoint} />]

    return (this.state.initialized) ? (
      <LazyContainer nextPage={(this.state.filter === null) ? null : this.state.subcategories.get(url).videos.get(this.state.filter).nextPage} 
        onLazy={this.retrieveVideos}>
        <CollapsibleTitleBar title={this.state.category.name}
          label="CATEGORY"
          tabs={tabs}
          controls={controls} />
          <Filter type="videos"
            onChanged={this.handleFitler} />
        <SmallGrid>
        {this.state.subcategories.get(url).videos.has(this.state.filter) && 
          this.state.subcategories.get(url).videos.get(this.state.filter).videos &&
          this.state.subcategories.get(url).videos.get(this.state.filter).videos.map((video) => (
            <Preview plays={video.plays}
              likes={video.likes}
              comments={video.comments.total}
              picture={video.picture}
              title={video.name}
              duration={video.duration}
              user={video.user}
              uri={video.uri}
              key={video.uri} />
          ))
        }</SmallGrid>
      </LazyContainer>
    ) : null
  }

}


export default SubcategoriesPage