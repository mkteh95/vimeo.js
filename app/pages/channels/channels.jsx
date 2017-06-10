import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { getChannels } from '../../services/api.js'

import LargeGrid from '../../containers/largeGrid/largeGrid.jsx'
import LazyContainer from '../../containers/lazyContainer/lazyContainer.jsx'
import CollapsibleTitleBar from '../../components/collapsibleTitleBar/collapsibleTitleBar.jsx'
import EntityPage from '../entity/entity.jsx'
import Card from '../../components/card/card.jsx'


class ChannelsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      channels: [],
      nextPage: 1
    }
  }

  fetchChannels(page) {
    getChannels(this.props.match.url, { filter: 'featured', sort: 'followers', page: page }).then((response) => {
      this.setState({
        channels: [...this.state.channels, ...response.channels],
        nextPage: response.paging.next
      })
    })
  }

  render() {
    return (
      <Switch>
        <Route path="/channels" exact render={() => (
            <LazyContainer nextPage={this.state.nextPage} onLazy={this.fetchChannels.bind(this)}>
              <CollapsibleTitleBar title="Channels" />
              <LargeGrid>{
                  this.state.channels.map((channel) => (
                    <Card banner={channel.banner} 
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