import React from 'react';

const Tile = (props) => {
  let tile;

  switch (props.tileType) {
    case 0:
      tile = <div className="tile grass" />;
      break;
    case 1:
      tile = <div className="tile rock" />;
      break;
    case 2:
      tile = <div className="tile tree" />;
      break;
    case 3:
      tile = <div className="tile water" />;
      break;
    default:
      tile = <div id={props.id} className={props.tileType} />;
  }

  return tile;
};

export default Tile;
