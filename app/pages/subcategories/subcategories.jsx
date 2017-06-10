import React from 'react'

import { getCategory, getVideos, subscribe } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Preview from '../../components/preview/preview.jsx'
import FollowButton from '../../components/followButton/followButton.jsx'


class SubcategoriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
      followed: false,
      category: {
        subcategories: [{
          uri: `/categories/${props.match.params.category}/subcategories/featured`,
          name: 'Featured'
        }]
      },
      subcategories: new Map([
        [`/categories/${props.match.params.category}/subcategories/featured`, {
          videos: [],
          nextPage: 1
        }]
      ])
    }
  }

  componentWillMount() {
    getCategory(`/categories/${this.props.match.params.category}`).then((response) => {
      this.setState({
        initialized: true,
        category: {
          ...response,
          subcategories: [...this.state.category.subcategories, ...response.subcategories]
        },
        subcategories: new Map([...this.state.subcategories,
          ...response.subcategories.map((subcategory) => {
            return [
              subcategory.uri, {
                videos: [],
                nextPage: 1
              }
            ]
          })
        ])
      })
    })
  }

  
  followCategory() {
    subscribe(`/me/categories/${this.props.match.params.category}`).then(() => {
      this.setState({
        followed: true
      })
    })
  }
  
  fetchVideos(page) {
    const endpoint = (this.props.match.url === `/categories/${this.props.match.params.category}/subcategories/featured`) 
                       ? `/categories/${this.props.match.params.category}/videos?sort=featured` 
                       : `${this.props.match.url}/videos`
    
    getVideos(endpoint, { page: page }).then((response) => {
      this.setState({
        subcategories: new Map([
          ...this.state.subcategories,
          [this.props.match.url, {
            videos: [...this.state.subcategories.get(this.props.match.url).videos, ...response.videos],
            nextPage: response.paging.next
          }]
        ])
      })
    })
  }

  render() {
    const url = this.props.match.url
    const tabs = this.state.category.subcategories.map((subcategory) => {
      return { path: subcategory.uri, label: subcategory.name }
    })
    
    const followEndpoint = `/me/categories/${this.props.match.params.category}`
    const controls = [<FollowButton uri={followEndpoint} key={followEndpoint} />]

    return (this.state.initialized) ? (
      <LazyContainer nextPage={this.state.subcategories.get(url).nextPage} onLazy={this.fetchVideos.bind(this)}>
        <CollapsibleTitleBar title={this.state.category.name}
          label="CATEGORY"
          tabs={tabs}
          controls={controls} />
        <SmallGrid>{
            this.state.subcategories.get(url).videos.map((video) => (
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