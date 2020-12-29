import { GetAgentWithId, ConsoleLogTest, RollRandom } from '../Utility';
import {
  GetTargetAgent,
} from '../Utility';
import _ from 'lodash';

const GetNewAgentPosition = (
  oldPosition,
  eventKey,
  columnsNum,
  rowsNum,
  frontGap,
  backGap
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

  // check boundaries, affect player agent only
  if (
    newPosition[0] < frontGap ||
    newPosition[0] >= columnsNum - backGap ||
    newPosition[1] < frontGap ||
    newPosition[1] >= rowsNum - backGap
  ) {
    return;
  }

  return newPosition;
};

const UpdateAgentPosition = (
  agent,
  newAgentPosition,
  oldAgentPosition,
  tilesStates
) => {
  let newState = tilesStates.slice(0);
  // Add old tile code player is on
  newState[oldAgentPosition[0]][oldAgentPosition[1]] =
    agent.state.tileCodeAgentOn;

  agent.UpdateAgent(newAgentPosition, tilesStates);

  // Add agent to new tile
  newState[newAgentPosition[0]][newAgentPosition[1]] = agent.state.id;

  return newState;
};

const HandleEvent = (agentId, oldAgentPosition, eventKey, state) => {
  // check keys
  ConsoleLogTest(state.test, 'key pressed ' + eventKey);

  let tilesStates = state.tilesStates;
  let newAgents = state.agents.map((a) => Object.assign({}, a));
  let agent = GetAgentWithId(agentId, newAgents);

  let newAgentPosition = GetNewAgentPosition(
    oldAgentPosition,
    eventKey,
    state.columns,
    state.rows,
    state.playerPosFrontEdgeGap,
    state.playerPosBackEdgeGap
  );

  // no movement, collison or invalid
  if (typeof newAgentPosition === 'undefined') return;

  let newTilesStates = UpdateAgentPosition(
    agent,
    newAgentPosition,
    oldAgentPosition,
    tilesStates
  // Update agents with deaths and position changes
  let enemyAgent = GetTargetAgent(newAgentPosition, newAgents, state);
  );

  return {
    agents: newAgents,
    tilesStates: newTilesStates // then move player
  };
};

const HandleAgentEvents = (agents, state) => {
  let activeAgent;
  let rollUpperLimits = [];
  let lastUpperLimit;

  agents.forEach((a, i) => {
    lastUpperLimit = i === 0 ? 0 : rollUpperLimits[i - 1];
    rollUpperLimits.push(a.state.agi + RollRandom(10) + lastUpperLimit);
  });

  // Roll up to max of sum
  let activeAgentRoll = RollRandom(rollUpperLimits[rollUpperLimits.length - 1]);

  rollUpperLimits.forEach((l, i) => {
    if (activeAgent === undefined && activeAgentRoll < l) {
      activeAgent = agents[i];
    }
  });

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
