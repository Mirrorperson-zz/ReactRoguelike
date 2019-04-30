import React, { Component } from 'react';
import Tile from './Tile';
import Player from './Player';
import {
  FindPonds,
  FindAdjecentWaterTiles,
  ResizePonds
} from '../PondsGeneration';

class Map extends Component {
  state = {
    columns: this.props.columns,
    rows: this.props.rows,
    tileStates: [[]],
    player: [0, 0],
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
    condenseLimit: 3
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

  getNewState = (
    playerLocation = [this.state.player[0], this.state.player[1]]
  ) => {
    let newState = [];

    for (let i = 0; i < this.props.rows; i++) {
      newState.push([]);
    }

    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.columns; j++) {
        if (j === playerLocation[0] && i === playerLocation[1]) {
          newState[i].push(this.state.tileTypes['player']);
        } else {
          let randomRoll = Math.floor(Math.random() * 99) + 1;

          if (
            randomRoll >= this.state.tileOccuranceLimits[0] &&
            randomRoll < this.state.tileOccuranceLimits[1]
          ) {
            newState[i].push(1);
          } else if (
            randomRoll >= this.state.tileOccuranceLimits[1] &&
            randomRoll < this.state.tileOccuranceLimits[2]
          ) {
            newState[i].push(2);
          } else if (
            randomRoll >= this.state.tileOccuranceLimits[2] &&
            randomRoll < this.state.tileOccuranceLimits[3]
          ) {
            newState[i].push(3);
          } else if (
            randomRoll >= this.state.tileOccuranceLimits[3] &&
            randomRoll < this.state.tileOccuranceLimits[4]
          ) {
            newState[i].push(4);
          }
        }
      }
    }

    let allPonds = FindPonds(newState, newState, this.props, this.state);
    let resizedPonds = ResizePonds(allPonds, newState, this.state);
    console.log(allPonds);

    return newState;
  };

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
    // console.log('key pressed ' + event.key);

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
