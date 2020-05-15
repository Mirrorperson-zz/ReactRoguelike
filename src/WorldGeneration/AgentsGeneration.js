import Agent from '../components/Agent';
import {
  GetAgentWithId,
  GetAgentTypes,
  ConsoleLogTest,
  RollRandom
} from '../Utility';
import AgentsData from '../AgentsContent.json';
import lodashLang from 'lodash/lang';

const InitializeAgents = (state, newTilesStates) => {
  let newAgents = [...state.agents];
  let agentsCounter = 0;

  let player = CreateAgent('a' + agentsCounter, 'player');
  newAgents.push(player);
  agentsCounter++;

  newTilesStates.forEach((row, rowi) => {
    row.forEach((columnTile, columni) => {
      // Roll about 10% for if there is an agent in tile
      let shouldCreateAgent = RollRandom(100) < 10 ? true : false;

      if (lodashLang.isEqual(player.state.position, [rowi, columni])) {
        shouldCreateAgent = false;
      }

      if (shouldCreateAgent) {
        // Roll another for what agent it should be, chances depending on tile type
        let agentToCreate = RollRandom(Object.keys(AgentsData).length - 1, 1);

        // Use Switch to vary changes depending on tile type - WIP
        switch (columnTile) {
          case state.tileTypes.grass:
            break;
          case state.tileTypes.rock:
            break;
          case state.tileTypes.tree:
            break;
          case state.tileTypes.water:
            break;
          default:
            break;
        }

        // Get key/name of agentToCreate from AgentsData after removing player
        let agentName = Object.keys(AgentsData).filter(
          (agentName) => agentName !== 'player'
        )[agentToCreate];

        newAgents.push(
          CreateAgent('a' + agentsCounter, agentName, [rowi, columni])
        );
        agentsCounter++;
      }
    });
  });

  ConsoleLogTest(state.test, GetAgentTypes());

  return newAgents;
};

const CreateAgent = (id, type, position = null) => {
  return new Agent({ id, type, position });
};

const UpdateStateWithAgents = (newTilesStates, newAgents) => {
  // set player - x and y are reversed, because array within array
  let playerAgent = GetAgentWithId('a0', newAgents);
  let playerPosition = playerAgent.state.position;
  newTilesStates[playerPosition[1]][playerPosition[0]] = playerAgent.state.id;

  newAgents.forEach((agent) => {
    let agentPosition = agent.state.position;
    newTilesStates[agentPosition[1]][agentPosition[0]] = agent.state.id;
  });

  return newTilesStates;
};

export { CreateAgent, UpdateStateWithAgents, InitializeAgents };
