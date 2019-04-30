import React, { Component } from 'react';
import Tile from './Tile';
import Player from './Player';
import { PondHasTile, GetTile } from '../Utility';

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

    // WIP
    let allPonds = this.findPonds(newState, newState);
    let resizedPonds = this.resizePonds(allPonds, newState);
    console.log(allPonds);

    return newState;
  };

  findPonds = (allPonds, newState) => {
    let newPonds = [];
    let pondsEmpty;
    let newPond;

    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.columns; j++) {
        if (allPonds[i][j] === this.state.tileTypes.water) {
          pondsEmpty = !newPonds.length > 0;

          // Check if any registered ponds exist
          if (!pondsEmpty) {
            // Check if tile is alread in a registered pond
            let inPond = [];
            for (let pondIndex = 0; pondIndex < newPonds.length; pondIndex++) {
              inPond.push(PondHasTile(newPonds[pondIndex], [i, j]));
            }

            // If tile not in any existing ponds newPond is true
            newPond = !inPond.includes(true);
          }

          // If no ponds exist or tile is of new pond
          if (pondsEmpty || newPond) {
            // Add new pond, first tile
            let newPondArray = [[i, j]];
            let checkTileRow;
            let checkTileColumn;

            // Check each adjecent tile is water, pushing new tiles into newPond
            for (
              let newPondTile = 0;
              newPondTile < newPondArray.length;
              newPondTile++
            ) {
              checkTileRow = newPondArray[newPondTile][0];
              checkTileColumn = newPondArray[newPondTile][1];

              //  Limit Tiles Check
              if (newPondTile < 10) {
                this.AddAdjecentWaterTiles(
                  newState,
                  checkTileRow,
                  checkTileColumn,
                  newPondArray
                );
              } else {
                console.log('Error - newPondTile >= 10');
              }
            }

            newPonds.push(newPondArray);
          }
        }
      }
    }

    return newPonds;
  };

  AddAdjecentWaterTiles = (newState, row, column, pondArray) => {
    // tile above unless at edge
    if (
      row !== 0 &&
      GetTile(newState, row - 1, column) === this.state.tileTypes.water
    ) {
      // Check it's not a tile already added
      if (!PondHasTile(pondArray, [row - 1, column])) {
        pondArray.push([row - 1, column]);
      }
    }

    // tile below unless at edge
    if (
      row !== this.state.rows - 1 &&
      GetTile(newState, row + 1, column) === this.state.tileTypes.water
    ) {
      // Check it's not a tile already added
      if (!PondHasTile(pondArray, [row + 1, column])) {
        pondArray.push([row + 1, column]);
      }
    }

    // tile left unless at edge
    if (
      column !== 0 &&
      GetTile(newState, row, column - 1) === this.state.tileTypes.water
    ) {
      // Check it's not a tile already added
      if (!PondHasTile(pondArray, [row, column - 1])) {
        pondArray.push([row, column - 1]);
      }
    }

    // tile right unless at edge
    if (
      column !== this.state.columns - 1 &&
      GetTile(newState, row, column + 1) === this.state.tileTypes.water
    ) {
      // Check it's not a tile already added
      if (!PondHasTile(pondArray, [row, column + 1])) {
        pondArray.push([row, column + 1]);
      }
    }
  };

  resizePonds = (allPonds, newState) => {
    let condenseCurrent = 0;
    let tileCount = 0;
    let condenseLimit = this.state.condenseLimit;
    let water = this.state.tileTypes['water'];
    let rows = this.state.rows;

    return allPonds.map(function(pond) {
      condenseCurrent = Math.floor(Math.random() * condenseLimit - 1) + 1;

      // if only one tile in pond then resize with condenseCurrent
      if (pond.length < 3) {
        for (
          let expandCount = 0;
          expandCount < condenseCurrent;
          expandCount++
        ) {
          pond.map(function(pondTile) {
            if (
              pondTile[0] !== 0 &&
              newState[pondTile[0] - 1][pondTile[1]] !== water &&
              expandCount < condenseCurrent
            ) {
              newState[pondTile[0] - 1][pondTile[1]] = water;
              expandCount++;
            }

            if (
              pondTile[0] !== rows - 1 &&
              newState[pondTile[0] + 1][pondTile[1]] !== water &&
              expandCount < condenseCurrent
            ) {
              newState[pondTile[0] + 1][pondTile[1]] = water;
              expandCount++;
            }

            if (
              pondTile[1] !== 0 &&
              newState[pondTile[0]][pondTile[1] - 1] !== water &&
              expandCount < condenseCurrent
            ) {
              newState[pondTile[0]][pondTile[1] - 1] = water;
              expandCount++;
            }

            if (
              pondTile[1] !== rows - 1 &&
              newState[pondTile[0]][pondTile[1] + 1] !== water &&
              expandCount < condenseCurrent
            ) {
              newState[pondTile[0]][pondTile[1] + 1] = water;
              expandCount++;
            }
          });
        }
      }
    });
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
