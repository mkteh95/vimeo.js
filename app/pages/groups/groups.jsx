import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getGroups } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import EntityPage from '../entity/entity.jsx'
import Card from '../../components/card/card.jsx'


class GroupsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      groups: [],
      nextPage: 1
    }
  }

  fetchGroups(page) {
    getGroups(this.props.match.url, { filter: 'featured', sort: 'followers', page: page }).then((response) => {
      this.setState({
        groups: [...this.state.groups, ...response.groups],
        nextPage: response.paging.next
      })
    })
  }

  render() {
    return (
      <Switch>
        <Route path="/groups" exact render={() => (
            <LazyContainer nextPage={this.state.nextPage} onLazy={this.fetchGroups.bind(this)}>
              <CollapsibleTitleBar title="Groups" />
              <SmallGrid>{
                  this.state.groups.map((group) => (
                    <Card banner={group.picture} 
                      title={group.name}
                      followers={group.followers}
                      videos={group.videos}
                      uri={group.uri}
                      key={group.uri} />
                  ))
                }</SmallGrid>
            </LazyContainer>
          )} />
        <Route path="/:page/:id" component={EntityPage} />
          )} />
      </Switch>
    )
  }

}


export default GroupsPage