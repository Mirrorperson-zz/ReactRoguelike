import React, { Component } from 'react';

class Player extends Component {
  state = {
    name: 'player',
    str: 5,
    agi: 5,
    dex: 5,
    wis: 5,
    int: 5
  };

  render() {
    return <div className="tile player" />;
  }
}

export default Player;
