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
      <div>
        <form
          className={`App-interface ${this.state.setSize ? '' : 'hidden'}`}
          onSubmit={this.handleSubmit}
        >
          <label>
            Select map size{' '}
            <span className={`${this.state.invalidSize ? 'warning-text' : ''}`}>
              (min: 7, max: 20)
            </span>
          </label>
          <br />
          <label>Height: </label>
          <input
            type="int"
            id="height"
            value={this.state.height}
            onChange={this.handleChange}
          />

          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

          <label id="lblWidth">Width: </label>
          <input
            type="int"
            id="width"
            value={this.state.width}
            onChange={this.handleChange}
          />

          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

          <input id="Submit" type="submit" />
        </form>

        <div id="App" className="App" />
      </div>
    );
  }
}

export default App;
