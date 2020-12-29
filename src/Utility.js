import AgentsData from './AgentsContent.json';

const GetPlayerAgentId = () => 'a0';

const PondHasTile = (pond, tile) => {
  let arrayChecks = pond.map(function(pondTile) {
    // Check if each tile in pond is same as tile
    if (pondTile[0] === tile[0] && pondTile[1] === tile[1]) {
      return true;
    } else {
      return false;
    }
  });

  // if any tile matches return true
  return arrayChecks.includes(true);
};

const GetTile = (state, row, column) => {
  return state[row][column];
};

const GetAgentIndexWithId = (id, agents) => {
  return agents.findIndex((agent) => {
    return agent.state.id === id;
  });
};

const GetAgentWithId = (id, agents) => {
  return agents.find((agent) => {
    return agent.state.id === id;
  });
};

const GetTargetAgent = (position, agents, state) => {
  let agentId = state.tilesAgentsStates[position[0]][position[1]];
  return GetAgentWithId(agentId, agents);
};

const GetAgentTypes = () => {
  return Object.keys(AgentsData);
};

const ConsoleLogTest = (test, message) => {
  if (test) {
    console.log(message);
  }
};

// does not work with negative numbers
const RollRandom = (max, min = 1) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const UpdateStateWithAgents = (newTilesStates, newAgents) => {
  let newTilesAgentsStates = [...newTilesStates.map((x) => [...x])];

  newAgents.forEach((agent) => {
    let agentPosition = agent.state.position;
    newTilesAgentsStates[agentPosition[0]][agentPosition[1]] = agent.state.id;
  });

  return newTilesAgentsStates;
};

export {
  PondHasTile,
  GetTile,
  GetAgentWithId,
  GetAgentTypes,
  ConsoleLogTest,
  RollRandom,
  GetPlayerAgentId,
  GetTargetAgent,
  GetAgentIndexWithId,
  UpdateStateWithAgents
};
