import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getChannels } from '../../services/api.js'

import LargeGrid from '../../containers/largeGrid/largeGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import EntityPage from '../entity/entity.jsx'
import Card from '../../components/card/card.jsx'
import Filter from '../../components/filter/filter.jsx'


class ChannelsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      channels: new Map(),
      filter: null
    }

    this.handleFilter = this.changeFilter.bind(this)
  }

  fetchChannels(page) {
    getChannels(this.props.match.url, { page: page, ...this.state.filter }).then((response) => {
      const curr = this.state.channels.get(this.state.filter)

      this.state.channels.set(this.state.filter, {
        channels: (curr.channels) ? [...curr.channels, ...response.channels] : response.channels,
        nextPage: response.paging.next
      })

      this.setState({
        channels: this.state.channels
      })
    })
  }

  changeFilter(selected) {
    if (this.state.channels.has(selected.value)) {
      this.setState({
        filter: selected.value
      })
    } else {
      this.state.channels.set(selected.value, {
        channels: null,
        nextPage: 1
      })

      this.setState({
        channels: this.state.channels,
        filter: selected.value
      })
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/channels" exact render={() => (
            <LazyContainer nextPage={(this.state.filter === null) ? null : this.state.channels.get(this.state.filter).nextPage} 
              onLazy={this.fetchChannels.bind(this)}>
              <CollapsibleTitleBar title="Channels" />
              <Filter type="channels"
                onChanged={this.handleFilter} />
              <LargeGrid>
              {this.state.channels.has(this.state.filter) && 
                this.state.channels.get(this.state.filter).channels &&
                this.state.channels.get(this.state.filter).channels.map((channel) => (
                  <Card banner={channel.banner} 
                    privacy={channel.privacy}
                    link={channel.link}
                    title={channel.name}
                    description={channel.description}
                    followers={channel.followers}
                    videos={channel.videos}
                    uri={channel.uri}
                    key={channel.uri} />
                ))
              }</LargeGrid>
            </LazyContainer>
          )} />
        <Route path="/:page/:id" component={EntityPage} />
      </Switch>
    )
  }

}


export default ChannelsPage