import React from 'react';
import ReactDOM from 'react-dom';
import { Agent } from './Agent';
import {
  GetActiveAgent,
  GetNewAgentPosition,
  HandleAgentEvents
} from './Events';
import AgentsData from '../AgentsContent.json';
import { CreateAgent } from '../WorldGeneration/AgentsGeneration';

const defaultEdgeGap = 2;

var agents = [];
var numberOfAgents = 5;
let agentNames = Object.keys(AgentsData);

for (var i = 0; i < numberOfAgents; i++) {
  agents.push(
    CreateAgent('a' + i, agentNames[i], [defaultEdgeGap, defaultEdgeGap + i])
  );
}

it('list contains random active agent choosen from it', () => {
  var activeAgent = GetActiveAgent(agents);
  expect(agents).toContain(activeAgent);
});

it('calculates dog agents new position correctly', () => {
  expect(
    GetNewAgentPosition(
      [0, 1],
      'ArrowRight',
      7,
      7,
      defaultEdgeGap,
      defaultEdgeGap,
      'dog'
    )
  ).toEqual([1, 1]);

  expect(
    GetNewAgentPosition(
      [2, 3],
      'ArrowLeft',
      7,
      7,
      defaultEdgeGap,
      defaultEdgeGap,
      'dog'
    )
  ).toEqual([1, 3]);
});

it('stops player agent going out of boundary', () => {
  expect(
    GetNewAgentPosition(
      [2, 3],
      'ArrowLeft',
      7,
      7,
      defaultEdgeGap,
      defaultEdgeGap,
      'player'
    )
  ).toBeUndefined();
});

var testAgent = agents[0];
var newAgentPosition = GetNewAgentPosition(
  testAgent.state.position,
  'ArrowRight',
  7,
  7,
  defaultEdgeGap,
  defaultEdgeGap,
  'player'
);
var expectedNewAgentPosition;

// x and y are inverted here, each inner array is a column
// -----> y
var testTilesStates = [
  // |
  [0, 0, 0, 0, 0, 0, 0], // V
  [0, 0, 0, 0, 0, 0, 0], // x
  [0, 0, 'a0', 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

var expectedTilesStates = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 'a0', 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

// it("updates agent's position and returns new state with updated position", () => {
//   expectedNewAgentPosition = [...testAgent.state.position];
//   expectedNewAgentPosition[0]++;

//   testTilesStates = UpdateAgentPosition(
//     testAgent,
//     newAgentPosition,
//     testAgent.state.position,
//     testTilesStates
//   );
//   expect(testTilesStates).toEqual(expectedTilesStates);
//   expect(testAgent.state.position).toEqual(expectedNewAgentPosition);
// });

it("UpdateAgent updates agent's position", () => {
  // update testTilesStates to keep test data consistent with agent
  testTilesStates = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 'a0', 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  expectedNewAgentPosition = [...testAgent.state.position];
  expectedNewAgentPosition[1]++;

  testAgent.UpdateAgent(expectedNewAgentPosition, testTilesStates);
  expect(testAgent.state.position).toEqual(expectedNewAgentPosition);
});

it('handles agent actions correctly', () => {
  let state = JSON.parse(
    '{"test":true,"agentCounter":10,"columns":10,"rows":10,"tilesStates":[[2,0,0,3,"a1",2,1,3,3,0],[0,3,1,3,0,0,1,"a2",3,2],[0,3,0,3,2,0,3,3,3,1],[1,3,"a0",0,"a3",0,0,3,0,0],[1,0,0,0,2,"a4",0,3,2,0],[2,1,2,2,0,3,0,2,0,2],[0,2,0,0,3,3,3,0,1,0],[0,"a5",0,2,3,0,3,0,0,0],["a6",3,0,0,0,3,3,2,1,0],[3,3,"a7","a8",0,"a9",3,0,1,0]],"tilesAgentsStates":[[2,0,0,3,"a1",2,1,3,3,0],[0,3,1,3,0,0,1,"a2",3,2],[0,3,0,3,2,0,3,3,3,1],[1,3,"a0",0,"a3",0,0,3,0,0],[1,0,0,0,2,"a4",0,3,2,0],[2,1,2,2,0,3,0,2,0,2],[0,2,0,0,3,3,3,0,1,0],[0,"a5",0,2,3,0,3,0,0,0],["a6",3,0,0,0,3,3,2,1,0],[3,3,"a7","a8",0,"a9",3,0,1,0]],"tileTypes":{"grass":0,"rock":1,"tree":2,"water":3},"tileOccuranceLimits":[0,60,75,85,100],"ponds":[],"condenseLimit":3,"agents":[{"props":{"id":"a0","type":"player","position":null},"refs":{},"updater":{},"state":{"id":"a0","type":"player","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[3,2],"tileCodeAgentOn":3}},{"props":{"id":"a1","type":"piranha","position":[0,4]},"refs":{},"updater":{},"state":{"id":"a1","type":"piranha","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[0,4],"tileCodeAgentOn":0}},{"props":{"id":"a2","type":"silverback-gorilla","position":[1,7]},"refs":{},"updater":{},"state":{"id":"a2","type":"silverback-gorilla","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[1,7],"tileCodeAgentOn":0}},{"props":{"id":"a3","type":"pigeon","position":[3,4]},"refs":{},"updater":{},"state":{"id":"a3","type":"pigeon","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[3,4],"tileCodeAgentOn":0}},{"props":{"id":"a4","type":"silverback-gorilla","position":[4,5]},"refs":{},"updater":{},"state":{"id":"a4","type":"silverback-gorilla","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[4,5],"tileCodeAgentOn":0}},{"props":{"id":"a5","type":"alligator","position":[7,1]},"refs":{},"updater":{},"state":{"id":"a5","type":"alligator","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[7,1],"tileCodeAgentOn":0}},{"props":{"id":"a6","type":"pigeon","position":[8,0]},"refs":{},"updater":{},"state":{"id":"a6","type":"pigeon","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[8,0],"tileCodeAgentOn":0}},{"props":{"id":"a7","type":"pigeon","position":[9,2]},"refs":{},"updater":{},"state":{"id":"a7","type":"pigeon","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[9,2],"tileCodeAgentOn":0}},{"props":{"id":"a8","type":"piranha","position":[9,3]},"refs":{},"updater":{},"state":{"id":"a8","type":"piranha","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[9,3],"tileCodeAgentOn":0}},{"props":{"id":"a9","type":"tarantula","position":[9,5]},"refs":{},"updater":{},"state":{"id":"a9","type":"tarantula","str":5,"agi":5,"dex":5,"wis":5,"int":5,"position":[9,5],"tileCodeAgentOn":0}}],"playerPosEdgeGap":2,"playersTurn":false}'
  );
  agents = [];
  state.agents.forEach((a) => {
    agents.push(
      Object.assign(CreateAgent(a.state.id, a.state.type, a.state.position), a)
    );
  });
  state.agents = agents;

  expect(HandleAgentEvents(state)).toEqual();
});
