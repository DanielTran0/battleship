import React from 'react';

function PlayerBoard(props) {
  const numberAxis = [...Array(11).keys()].map((item, index) => {
    if (item === 0) return null;
    return (
      <div className="axisItem" key={index}>
        {item}
      </div>
    );
  });

  const letterAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((item, index) => {
    return (
      <div className="axisItem" key={index}>
        {item}
      </div>
    );
  });

  const generateGridCoordinates = () => {
    const gridCoordinates = [];

    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        gridCoordinates.push(JSON.stringify({ x: j, y: i }));
      }
    }

    return gridCoordinates;
  };

  const generateShipMarking = (coordinate) => {
    if (props.computerBoard) return '';

    let shipName;

    const spotIsShip = props.ships.some((ship) => {
      return ship.coordinates.some((sCoordinate) => {
        shipName = ship.details.name;

        return JSON.stringify(sCoordinate) === coordinate;
      });
    });

    if (spotIsShip) {
      let className;

      switch (shipName) {
        case 'Carrier':
          className = 'gridShip1';
          break;
        case 'Battleship':
          className = 'gridShip2';
          break;
        case 'Destroyer':
          className = 'gridShip3';
          break;
        case 'Submarine':
          className = 'gridShip4';
          break;
        case 'Cruiser':
          className = 'gridShip5';
          break;

        default:
      }
      return className;
    }

    return '';
  };

  const generateMissHitMarking = (coordinate) => {
    const isMissedHit = props.missedHits.some(
      (missedHit) => JSON.stringify(missedHit) === coordinate
    );

    const isSuccessfulHit = props.successfulHits.some(
      (successfulHit) => JSON.stringify(successfulHit) === coordinate
    );

    if (isMissedHit) return <i className="fas fa-circle"></i>;
    if (isSuccessfulHit) return 'X';

    return null;
  };

  const generateSunkMarking = (coordinate) => {
    return props.ships.some((ship) => {
      return ship.coordinates.some((coord) => {
        if (JSON.stringify(coord) === coordinate && ship.details.isSunk()) return true;
        return false;
      });
    });
  };

  const grid = generateGridCoordinates().map((coord, index) => {
    return (
      <div
        key={index}
        className={`square ${
          props.computerBoard && !props.gameOver && !generateMissHitMarking(coord)
            ? 'clickable'
            : ''
        } ${generateShipMarking(coord)} ${generateMissHitMarking(coord) === 'X' ? 'hit' : ''} ${
          generateSunkMarking(coord) ? 'sunk' : ''
        } `}
        data-coordinate={coord}
        onClick={
          props.handlePlayerAttack && props.computerBoard
            ? () => props.handlePlayerAttack(coord)
            : null
        }
      >
        <span className={'missHit'}>{generateMissHitMarking(coord)}</span>
      </div>
    );
  });

  const shipsRemaining = () => {
    if (props.ships === undefined) return;

    return props.ships.reduce((tot, cur) => {
      if (cur.details.isSunk()) return tot;

      return (tot += 1);
    }, 0);
  };

  return (
    <div className="playerBoard">
      <h2 className={!props.computerBoard ? 'playerBoardTitle' : ''}>{props.title}</h2>
      <div className="singleBoard">
        <div></div>
        <div className="numberAxis">{numberAxis}</div>
        <div className="letterAxis">{letterAxis}</div>
        <div className="grid">{grid}</div>
      </div>
      <p className={!props.computerBoard ? 'playerRemain' : ''}>
        {props.gameStart
          ? props.computerBoard
            ? `Enemy Ships Remaining: ${shipsRemaining()}`
            : `Your Ships Remaining: ${shipsRemaining()}`
          : null}
      </p>
    </div>
  );
}

export default PlayerBoard;
