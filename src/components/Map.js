import React, { Component } from 'react';
import Tile from './Tile';
import Agent from './Agent';
import { GetNewState } from '../WorldGeneration/MapGeneration';
import {
  UpdateStateWithAgents,
  InitializeAgents
} from '../WorldGeneration/AgentsGeneration';
import { GetAgentWithId, ConsoleLogTest } from '../Utility';

class Map extends Component {
  state = {
    test: this.props.test,
    agentCounter: 0,
    columns: this.props.columns,
    rows: this.props.rows,
    tilesStates: [[]],
    tilesAgentsStates: [[]],
    tileTypes: {
      player: 0,
      grass: 1,
      rock: 2,
      tree: 3,
      water: 4
    },
    tileOccuranceLimits: [0, 60, 75, 85, 100],
    playerOn: 1,
    ponds: [],
    condenseLimit: 3,
    agents: []
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      tileStates: this.getNewState(),
      playerOn: Math.floor(
        Math.random() * (Object.keys(this.state.tileTypes).length - 1) + 1
      )
    };
  }

  updatePlayerPos = (
    playerLocation = [this.state.player[0], this.state.player[1]]
    // Flip when use as colums in rows means need [y,x]
  ) => {
    let newPosState = this.state.tileStates.slice(0);
    // Add old tile player is on
    newPosState[this.state.player[1]][
      this.state.player[0]
    ] = this.state.playerOn;
    // Add player to new tile
    newPosState[playerLocation[1]][playerLocation[0]] = this.state.tileTypes[
      'player'
    ];

    return newPosState;
  };

  // movement controls
  handleKeyPress = event => {
    // check keys
    ConsoleLogTest(this.state.test, 'key pressed ' + event.key);

    let player = [...this.state.player];
    let stateChanged = true;

    // TileStates is an array in an array; first array index is rows and send array index is columns.
    // Fist index controls vertical movement, second index controls horizontal movement
    switch (event.key) {
      case 'ArrowLeft':
        player = [this.state.player[0] - 1, this.state.player[1]];
        if (this.state.player[0] <= 0) return;
        break;

      case 'ArrowRight':
        player = [this.state.player[0] + 1, this.state.player[1]];
        if (this.state.player[0] >= this.props.columns - 1) return;
        break;

      case 'ArrowUp':
        player = [this.state.player[0], this.state.player[1] - 1];
        if (this.state.player[1] <= 0) return;
        break;

      case 'ArrowDown':
        player = [this.state.player[0], this.state.player[1] + 1];
        if (this.state.player[1] >= this.props.rows - 1) return;
        break;

      default:
        stateChanged = false;
    }

    if (stateChanged) {
      this.setState(state => ({
        player,
        playerOn: this.state.tileStates[player[1]][player[0]], // Order matters store tile player moving to
        tileStates: this.updatePlayerPos(player) // then move player
      }));
    }
  };

  render() {
    return (
      <div tabIndex="0" onKeyDown={this.handleKeyPress}>
        {this.state.tileStates.map((rows, index) => (
          <div key={index}>
            {this.state.tileStates[index].map((tileType, colIndex) =>
              tileType === 0 ? (
                <Player key={index * this.state.rows + colIndex} />
              ) : (
                <Tile
                  tileType={tileType}
                  key={index * this.state.rows + colIndex}
                />
              )
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default Map;
