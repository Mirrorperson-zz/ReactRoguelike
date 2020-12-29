import {
  GetAgentWithId,
  ConsoleLogTest,
  RollRandom,
  GetTargetAgent,
  UpdateStateWithAgents
} from '../Utility';
import { EvaluateCombat } from '../components/Combat';
import _ from 'lodash';

const GetNewAgentPosition = (
  oldPosition,
  eventKey,
  columnsNum,
  rowsNum,
  mapEdgeGap
) => {
  let newPosition;

  switch (eventKey) {
    case 'ArrowLeft':
      newPosition = [oldPosition[0] - 1, oldPosition[1]];
      break;
    case 'ArrowRight':
      newPosition = [oldPosition[0] + 1, oldPosition[1]];
      break;
    case 'ArrowUp':
      newPosition = [oldPosition[0], oldPosition[1] - 1];
      break;
    case 'ArrowDown':
      newPosition = [oldPosition[0], oldPosition[1] + 1];
      break;
    default:
      newPosition = oldPosition;
  }

  // to do: enemies cant leave map atm because it tries to find
  // what tile the the position is in agent.UpdateAgent() and
  // try to access index out of range of array

  // check boundaries - leaving map
  if (
    newPosition[0] < mapEdgeGap ||
    newPosition[0] >= columnsNum - mapEdgeGap ||
    newPosition[1] < mapEdgeGap ||
    newPosition[1] >= rowsNum - mapEdgeGap
  ) {
    return;
  }

  return newPosition;
};

const HandleEvent = (agentId, oldAgentPosition, eventKey, state) => {
  // check keys
  ConsoleLogTest(state.test, 'key pressed ' + eventKey);

  let newAgents = state.agents.map((a) => Object.assign({}, a));
  let agent = GetAgentWithId(agentId, newAgents);

  let mapEdgeGap = agent.state.type === 'player' ? state.playerPosEdgeGap : 0;

  let newAgentPosition = GetNewAgentPosition(
    oldAgentPosition,
    eventKey,
    state.columns,
    state.rows,
    mapEdgeGap,
    agent.state.type
  );

  // invalid movement outside of boundary
  if (typeof newAgentPosition === 'undefined') return;

  // Update agents with deaths and position changes
  let enemyAgent = GetTargetAgent(newAgentPosition, newAgents, state);
  if (enemyAgent) {
    EvaluateCombat(agent, enemyAgent, newAgents);
  }

  agent.UpdateAgent(newAgentPosition);
  let newTilesAgentsStates = UpdateStateWithAgents(
    state.tilesStates,
    newAgents
  );

  return {
    agents: newAgents,
    tilesAgentsStates: newTilesAgentsStates // then move player
  };
};

const GetActiveAgent = (agents) => {
  // return agents[RollRandom(agents.length)-1];

  let rollUpperLimits = [];
  let previousUpperLimit;

  agents.forEach((a, i) => {
    previousUpperLimit = i === 0 ? 0 : rollUpperLimits[i - 1];
    rollUpperLimits.push(a.state.agi + RollRandom(10) + previousUpperLimit);
  });

  // Roll up to max of sum
  let activeAgentRoll = RollRandom(rollUpperLimits[rollUpperLimits.length - 1]);

  for (const [index, limit] of Object.entries(rollUpperLimits)) {
    if (activeAgentRoll < limit) {
      return agents[index];
    }
  }
};

const HandleAgentEvents = (state) => {
  let activeAgent = GetActiveAgent(state.agents);

  if (activeAgent.state.type === 'player') {
    return;
  }

  // Todo make decision making smarter
  // may need to move to agent class if quite large
  let directionRoll = RollRandom(4);
  let eventKey;

  switch (directionRoll) {
    case 1:
      eventKey = 'ArrowLeft';
      break;
    case 2:
      eventKey = 'ArrowUp';
      break;
    case 3:
      eventKey = 'ArrowRight';
      break;
    case 4:
      eventKey = 'ArrowDown';
      break;
  }

  let newState = HandleEvent(
    activeAgent.state.id,
    activeAgent.state.position,
    eventKey,
    state
  );

  return newState;
};

export { HandleEvent, UpdateAgentPosition, HandleAgentEvents };
