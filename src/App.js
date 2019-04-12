import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import requireAuthentication from './utils/requireAuth'
import './styles/App.css';

import BeastIndex from './components/beast_index';
import BeastView from './components/beast_view';
import BeastNew from './components/beast_new';
import BeastEdit from './components/beast_edit';
import Header from './components/header';
import Landing from './components/landing';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Switch>
              <Route path="/beasts/new" component={requireAuthentication(BeastNew)} />
              <Route path="/beasts/:id/edit" component={BeastEdit} />
              <Route path="/beasts/:id" component={BeastView} />
              <Route path="/beasts" component={BeastIndex} />
              <Route path="/" component={Landing} />
          </Switch>
        </div>
      </div>

    );
  }
}

export default App;
