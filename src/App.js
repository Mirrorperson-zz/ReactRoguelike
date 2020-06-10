import React, { Component } from 'react';
import logo from './logo.svg';
import Map from './components/Map';
import './App.css';
import './Game.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 10,
      height: 10,
      setSize: true,
      invalidSize: false
    };
  }

  render() {
    return (
      <div className="App">
        <Map rows={10} columns={10} test={true} />
      </div>
    );
  }
}

export default App;
