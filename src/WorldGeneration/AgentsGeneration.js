import Agent from '../components/Agent';
import { GetAgentWithId, GetAgentTypes, ConsoleLogTest } from '../Utility';

const InitializeAgents = state => {
  var newAgents = [...state.agents];

  var player = CreateAgent('a' + state.agentCounter, 'player', [2, 2]);
  newAgents.push(player);

  ConsoleLogTest(state.test, GetAgentTypes());

  return newAgents;
};

const CreateAgent = (id, type, position) => {
  return new Agent({ id, type, position });
};

const UpdateStateWithAgents = (newTilesStates, newAgents) => {
  // set player - x and y are reversed cause array within array
  var playerAgent = GetAgentWithId('a0', newAgents);
  var playerPosition = playerAgent.state.position;
  newTilesStates[playerPosition[1]][playerPosition[0]] = playerAgent.state.id;
  return newTilesStates;
};

export { CreateAgent, UpdateStateWithAgents, InitializeAgents };
