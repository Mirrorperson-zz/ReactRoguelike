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
      grass: 0,
      rock: 1,
      tree: 2,
      water: 3
    },
    tileOccuranceLimits: [0, 60, 75, 85, 100],
    playerOn: 1,
    ponds: [],
    condenseLimit: 3,
    agents: []
  };

  constructor(props) {
    super(props);

    let newTilesStates = GetNewState(props, this.state);
    let newAgents = InitializeAgents(this.state, newTilesStates);
    let newTilesStateWithAgents = UpdateStateWithAgents(
      newTilesStates,
      newAgents
    );

    this.state = {
      ...this.state,
      agents: newAgents,
      tilesStates: newTilesStates,
      tilesAgentsStates: newTilesStateWithAgents,
      agentCounter: this.state.agentCounter + newAgents.length
    };
  }

  updatePlayerPos = (
    newPlayerPosition,
    oldPlayerPosition
    // Flip when use as colums in rows means need [y,x]
  ) => {
    let newState = this.state.tilesStates.slice(0);
    // Add old tile player is on
    newState[oldPlayerPosition[1]][oldPlayerPosition[0]] = this.state.playerOn;

    // Add player to new tile - a0 is player agent's id
    newState[newPlayerPosition[1]][newPlayerPosition[0]] = 'a0';

    return newState;
  };

  // movement controls
  handleKeyPress = event => {
    // check keys
    ConsoleLogTest(this.state.test, 'key pressed ' + event.key);

    let newAgents = [...this.state.agents];
    let oldPlayerPosition = [...GetAgentWithId('a0', newAgents).state.position];
    let newPlayerPosition;

    // TileStates is an array in an array; first array index is rows and send array index is columns.
    // Fist index controls vertical movement, second index controls horizontal movement
    switch (event.key) {
      case 'ArrowLeft':
        newPlayerPosition = [oldPlayerPosition[0] - 1, oldPlayerPosition[1]];
        if (newPlayerPosition[0] <= 0) return;
        break;

      case 'ArrowRight':
        newPlayerPosition = [oldPlayerPosition[0] + 1, oldPlayerPosition[1]];
        if (newPlayerPosition[0] >= this.props.columns - 1) return;
        break;

      case 'ArrowUp':
        newPlayerPosition = [oldPlayerPosition[0], oldPlayerPosition[1] - 1];
        if (newPlayerPosition[1] <= 0) return;
        break;

      case 'ArrowDown':
        newPlayerPosition = [oldPlayerPosition[0], oldPlayerPosition[1] + 1];
        if (newPlayerPosition[1] >= this.props.rows - 1) return;
        break;

      default:
        newPlayerPosition = oldPlayerPosition;
    }

    GetAgentWithId('a0', newAgents).state.position = newPlayerPosition;

    if (newPlayerPosition !== oldPlayerPosition) {
      this.setState(state => ({
        agents: newAgents,
        playerOn: this.state.tilesStates[newPlayerPosition[1]][
          newPlayerPosition[0]
        ], // Order matters store tile player moving to
        tileStates: this.updatePlayerPos(newPlayerPosition, oldPlayerPosition) // then move player
      }));
    }
  };

  render() {
    ConsoleLogTest(this.state.test, this.state.tilesAgentsStates);
    return (
      <div tabIndex="0" onKeyDown={this.handleKeyPress}>
        {this.state.tilesAgentsStates.map((rows, index) => (
          <div key={index}>
            {this.state.tilesAgentsStates[index].map((tileType, colIndex) => (
              <Tile
                tileType={
                  tileType[0] === 'a'
                    ? 'tile ' +
                      GetAgentWithId(tileType, this.state.agents).state.type
                    : tileType
                }
                key={index * this.state.rows + colIndex}
                test={this.state.test}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Map;
