export const PondHasTile = function(pond, tile) {
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

export const GetTile = function(state, row, column) {
  return state[row][column];
};

const ConsoleLogTest = (test, message) => {
  if (test) {
    console.log(message);
  }
};

export { PondHasTile, GetTile, GetAgentWithId, GetAgentTypes, ConsoleLogTest };
