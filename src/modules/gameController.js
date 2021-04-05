import createShip from './createShip';

const gameController = (() => {
  const shipTypes = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Cruiser', size: 2 },
  ];

  const randomizeShipLocations = (gameBoard) => {
    if (gameBoard.ships.length !== 0) gameBoard.resetBoard();

    const shipPlacementDirections = ['u', 'r'];

    shipTypes.forEach((ship) => {
      let isValidPlacement = false;

      while (!isValidPlacement) {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);
        const randomDirection = shipPlacementDirections[Math.floor(Math.random() * 2)];

        isValidPlacement = gameBoard.placeShip(
          createShip(ship.size, ship.name),
          randomX,
          randomY,
          randomDirection
        );
      }
    });

    return true;
  };

  const playerMove = (computerBoard, x, y) => {
    return computerBoard.receiveHit(x, y);
  };

  const generateComputerMoveFromHit = (playerBoard) => {
    const {
      coordinate: { x: oldX, y: oldY },
      hitAxis,
    } = playerBoard.lastHitShip[0];
    const axisChange = ['x', 'y'];
    let isHit = null;

    if (hitAxis === undefined) {
      while (isHit === null) {
        let randomAxis = axisChange[Math.floor(Math.random() * 2)];

        if (randomAxis === 'x') {
          if (oldX + 1 <= 10) isHit = playerBoard.receiveHit(oldX + 1, oldY, 'x+');

          if (isHit === null && oldX - 1 >= 1) isHit = playerBoard.receiveHit(oldX - 1, oldY, 'x-');
        } else if (randomAxis === 'y') {
          if (oldY + 1 <= 10) isHit = playerBoard.receiveHit(oldX, oldY + 1, 'y+');

          if (isHit === null && oldY - 1 >= 1) isHit = playerBoard.receiveHit(oldX, oldY - 1, 'y-');
        }
      }
    } else if (hitAxis[0] === 'x') {
      if (hitAxis === 'x+' && oldX + 1 <= 10) isHit = playerBoard.receiveHit(oldX + 1, oldY, 'x+');
      if (hitAxis === 'x-' && oldX - 1 >= 1) isHit = playerBoard.receiveHit(oldX - 1, oldY, 'x-');

      let changeX = 1;
      while (isHit === null) {
        if (hitAxis === 'x+' && oldX - 1 >= 1) {
          isHit = playerBoard.receiveHit(oldX - changeX, oldY, 'x+');
          changeX += 1;
        }

        if (hitAxis === 'x-' && oldX + 1 <= 10) {
          isHit = playerBoard.receiveHit(oldX + changeX, oldY, 'x-');
          changeX += 1;
        }
      }
    } else if (hitAxis[0] === 'y') {
      if (hitAxis === 'y+' && oldY + 1 <= 10) isHit = playerBoard.receiveHit(oldX, oldY + 1, 'y+');
      if (hitAxis === 'y-' && oldY - 1 >= 1) isHit = playerBoard.receiveHit(oldX, oldY - 1, 'y-');

      let changeY = 1;
      while (isHit === null) {
        if (hitAxis === 'y+' && oldY - 1 >= 1) {
          isHit = playerBoard.receiveHit(oldX, oldY - changeY, 'y+');
          changeY += 1;
        }

        if (hitAxis === 'y-' && oldY + 1 <= 10) {
          isHit = playerBoard.receiveHit(oldX, oldY + changeY, 'y-');
          changeY += 1;
        }
      }
    }

    return isHit;
  };

  const computerMove = (playerBoard, isLastMoveHit) => {
    if (isLastMoveHit && !playerBoard.lastHitShip[0].ship.details.isSunk()) {
      return generateComputerMoveFromHit(playerBoard);
    }

    let x = Math.floor(Math.random() * 10) + 1;
    let y = Math.floor(Math.random() * 10) + 1;
    let isHit = playerBoard.receiveHit(x, y);

    if (isHit === null) {
      while (isHit === null) {
        x = Math.floor(Math.random() * 10) + 1;
        y = Math.floor(Math.random() * 10) + 1;
        isHit = playerBoard.receiveHit(x, y);
      }
    }

    return isHit;
  };

  return { randomizeShipLocations, playerMove, computerMove };
})();

export default gameController;
