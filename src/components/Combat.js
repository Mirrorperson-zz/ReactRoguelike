const EvaluateCombat = (agent, enemy, newAgents) => {
  if (agent.state.str > enemy.state.str) {
    agent.state.str -= enemy.state.str;

    enemy.PerformDeath(newAgents);

    return agent;
  } else {
    agent.PerformDeath(newAgents);

    enemy.state.str -= agent.state.str;
    if (enemy.state.str <= 0) {
      enemy.PerformDeath(newAgents);
    }

    return null;
  }
};

const UpdateAgentsTilesStatesAfterCombat = (newTilesStates, newAgents) => {};

export { EvaluateCombat };
