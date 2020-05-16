import { PondHasTile, GetTile, ConsoleLogTest, RollRandom } from '../Utility';

const GetNewState = (props, state, tileOccuranceLimits, test = false) => {
  let newState = [];

  for (let i = 0; i < props.rows; i++) {
    newState.push([]);
  }

  for (let i = 0; i < props.rows; i++) {
    for (let j = 0; j < props.columns; j++) {
      let randomRoll = RollRandom(100);

      if (
        randomRoll >= tileOccuranceLimits[0] &&
        randomRoll < tileOccuranceLimits[1]
      ) {
        newState[i].push(1);
      } else if (
        randomRoll >= tileOccuranceLimits[1] &&
        randomRoll < tileOccuranceLimits[2]
      ) {
        newState[i].push(2);
      } else if (
        randomRoll >= tileOccuranceLimits[2] &&
        randomRoll < tileOccuranceLimits[3]
      ) {
        newState[i].push(3);
      } else if (
        randomRoll >= tileOccuranceLimits[3] &&
        randomRoll < tileOccuranceLimits[4]
      ) {
        newState[i].push(4);
      }
    }
  }

  let allPonds = FindPonds(props, state, newState, newState);
  ResizePonds(state, allPonds, newState);
  ConsoleLogTest(test, allPonds);

  return newState;
};

const FindPonds = (props, state, allPonds, newState) => {
  let newPonds = [];
  let pondsEmpty;
  let newPond;

  for (let i = 0; i < props.rows; i++) {
    for (let j = 0; j < props.columns; j++) {
      if (allPonds[i][j] === state.tileTypes.water) {
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
              AddAdjecentWaterTiles(
                state,
                newState,
                checkTileRow,
                checkTileColumn,
                newPondArray
              );
            } else {
              ConsoleLogTest(state.test, 'Error - newPondTile >= 10');
            }
          }

          newPonds.push(newPondArray);
        }
      }
    }
  }

  return newPonds;
};

const AddAdjecentWaterTiles = (state, newState, row, column, pondArray) => {
  // tile above unless at edge
  if (
    row !== 0 &&
    GetTile(newState, row - 1, column) === state.tileTypes.water
  ) {
    // Check it's not a tile already added
    if (!PondHasTile(pondArray, [row - 1, column])) {
      pondArray.push([row - 1, column]);
    }
  }

  // tile below unless at edge
  if (
    row !== state.rows - 1 &&
    GetTile(newState, row + 1, column) === state.tileTypes.water
  ) {
    // Check it's not a tile already added
    if (!PondHasTile(pondArray, [row + 1, column])) {
      pondArray.push([row + 1, column]);
    }
  }

  // tile left unless at edge
  if (
    column !== 0 &&
    GetTile(newState, row, column - 1) === state.tileTypes.water
  ) {
    // Check it's not a tile already added
    if (!PondHasTile(pondArray, [row, column - 1])) {
      pondArray.push([row, column - 1]);
    }
  }

  // tile right unless at edge
  if (
    column !== state.columns - 1 &&
    GetTile(newState, row, column + 1) === state.tileTypes.water
  ) {
    // Check it's not a tile already added
    if (!PondHasTile(pondArray, [row, column + 1])) {
      pondArray.push([row, column + 1]);
    }
  }
};

const ResizePonds = (state, allPonds, newState) => {
  let condenseCurrent = 0;
  let condenseLimit = state.condenseLimit;
  let water = state.tileTypes.water;
  let rows = state.rows;

  return allPonds.map(function(pond) {
    condenseCurrent = Math.floor(Math.random() * condenseLimit - 1) + 1;

    // if only one tile in pond then resize with condenseCurrent
    if (pond.length < 3) {
      for (let expandCount = 0; expandCount < condenseCurrent; expandCount++) {
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

export { ResizePonds, FindPonds, GetNewState };
