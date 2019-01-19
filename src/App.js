import React, { Component } from 'react';
import logo from './logo.svg';
import Map from './components/Map';
import './App.css';
import './Game.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map rows={10} columns={10} />
      </div>
    );
  }
}

export default App;
