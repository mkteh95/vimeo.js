import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getGroups } from '../../services/api.js'

import SmallGrid from '../../containers/smallGrid/smallGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import EntityPage from '../entity/entity.jsx'
import Card from '../../components/card/card.jsx'
import Filter from '../../components/filter/filter.jsx'


class GroupsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      groups: new Map(),
      filter: null
    }

    this.handleFilter = this.changeFilter.bind(this)
  }

  fetchGroups(page) {
    getGroups(this.props.match.url, { page: page, ...this.state.filter }).then((response) => {
      const curr = this.state.groups.get(this.state.filter)

      this.state.groups.set(this.state.filter, {
        groups: (curr.groups) ? [...curr.groups, ...response.groups] : response.groups,
        nextPage: response.paging.next
      })

      this.setState({
        groups: this.state.groups
      })
    })
  }

  changeFilter(selected) {
    if (this.state.groups.has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state.groups.set(selected.value, {
        groups: null,
        nextPage: 1
      })

      this.setState({
        groups: this.state.groups,
        filter: selected.value
      })
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/groups" exact render={() => (
            <LazyContainer nextPage={(this.state.filter === null) ? null : this.state.groups.get(this.state.filter).nextPage} 
              onLazy={this.fetchGroups.bind(this)}>
              <CollapsibleTitleBar title="Groups" />
              <Filter type="groups"
                onChanged={this.handleFilter} />
              <SmallGrid>
              {this.state.groups.has(this.state.filter) &&
                this.state.groups.get(this.state.filter).groups &&
                this.state.groups.get(this.state.filter).groups.map((group) => (
                  <Card banner={group.picture} 
                    privacy={group.privacy}
                    link={group.link}
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