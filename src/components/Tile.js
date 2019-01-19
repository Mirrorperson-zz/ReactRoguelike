import React from 'react';

const Tile = props => {
  let tile;
  //console.log(props.tileType);
  switch (props.tileType) {
    case 1:
      tile = <div className="tile grass" />;
      break;
    case 2:
      tile = <div className="tile rock" />;
      break;
    case 3:
      tile = <div className="tile tree" />;
      break;
    case 4:
      tile = <div className="tile water" />;
      break;
    default:
      tile = <div className="tile grass" />;
  }

  return tile;
};

export default Tile;
