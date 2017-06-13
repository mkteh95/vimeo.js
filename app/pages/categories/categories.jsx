import React from 'react'
import { Redirect, Switch, Route, Link } from 'react-router-dom'

import { getCategories } from '../../services/api.js'

import SubcategoriesPage from '../subcategories/subcategories.jsx'
import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import Tile from '../../components/tile/tile.jsx'


class CategoriesPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      categories: null,
      nextPage: 1
    }
  }

  fetchCategories(page) {
    getCategories(this.props.match.url, { page: page }).then((response) => {
      this.setState({
        categories: (this.state.categories) ? [...this.state.categories, ...response.categories] : response.categories,
        nextPage: response.paging.next
      })
    })
  }

  render() {
    return (
      <Switch>
        <Route path="/categories/:category/subcategories/:subcategory/videos" component={SubcategoriesPage} />
        <Route path="/categories/:category" render={(props) => (
          <Redirect to={`/categories/${props.match.params.category}/subcategories/featured/videos`} />
        )} />
        <Route path="/categories" render={() => (
            <LazyContainer nextPage={this.state.nextPage} onLazy={this.fetchCategories.bind(this)}>
              <CollapsibleTitleBar title="Categories" />
              <SmallGrid>
                {this.state.categories &&
                  this.state.categories.map((category) => (
                    <Tile picture={category.picture} 
                      icon={category.icon}
                      caption={category.name}
                      uri={`${category.uri}`}
                      key={category.uri} />
                  ))
                }
              </SmallGrid>
            </LazyContainer>
          )} />
      </Switch>
    )
  }

}


export default CategoriesPage