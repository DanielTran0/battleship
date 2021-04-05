const createGameBoard = () => {
  let ships = [];
  let usedShipCoordinates = [];
  let missedHits = [];
  let successfulHits = [];
  let lastHitShip = [];

  const generateShipCoordinates = (shipLength, x, y, direction) => {
    const shipCoordinates = [];

    for (let i = 0; i < shipLength; i++) {
      direction === 'u'
        ? shipCoordinates.push({ x: x, y: y + i })
        : shipCoordinates.push({ x: x + i, y: y });
    }

    return shipCoordinates;
  };

  const checkInvalidShipPlacementInBoundary = (shipLength, x, y, direction) => {
    if (x === 0 || y === 0 || x > 10 || y > 10) return true;

    if (direction === 'u') {
      if (y + shipLength - 1 > 10) return true;

      return false;
    }
    if (x + shipLength - 1 > 10) return true;

    return false;
  };

  const checkInvalidShipPlacementCollision = (shipCoordinates) => {
    return shipCoordinates.some((shipCoordinate) => {
      return usedShipCoordinates.some((usedCoordinate) => {
        const { x, y } = usedCoordinate;

        return (
          JSON.stringify(usedCoordinate) === JSON.stringify(shipCoordinate) ||
          JSON.stringify({ x: x + 1, y: y }) === JSON.stringify(shipCoordinate) ||
          JSON.stringify({ x: x - 1, y: y }) === JSON.stringify(shipCoordinate) ||
          JSON.stringify({ x: x, y: y + 1 }) === JSON.stringify(shipCoordinate) ||
          JSON.stringify({ x: x, y: y - 1 }) === JSON.stringify(shipCoordinate)
        );
      });
    });
  };

  const placeShip = (createdShip, x, y, direction) => {
    const shipCoordinates = generateShipCoordinates(createdShip.length, x, y, direction);

    if (checkInvalidShipPlacementInBoundary(createdShip.length, x, y, direction)) return false;
    if (checkInvalidShipPlacementCollision(shipCoordinates)) return false;

    ships.push({ coordinates: shipCoordinates, details: createdShip, direction: direction });
    usedShipCoordinates.push(...shipCoordinates);

    return true;
  };

  const checkForDuplicateHit = (hitCoordinates) => {
    return (
      missedHits.some((hit) => JSON.stringify(hit) === JSON.stringify(hitCoordinates)) ||
      successfulHits.some((hit) => JSON.stringify(hit) === JSON.stringify(hitCoordinates))
    );
  };

  const receiveHit = (hitX, hitY, computerRandomAxis) => {
    const hitCoordinates = { x: hitX, y: hitY };

    if (checkForDuplicateHit(hitCoordinates)) return null;

    const isHit = ships.some((ship) => {
      return ship.coordinates.some((coordinate) => {
        if (JSON.stringify(coordinate) === JSON.stringify(hitCoordinates)) {
          successfulHits.push(hitCoordinates);
          ship.details.hit(hitX, hitY);
          lastHitShip.length = 0;
          lastHitShip.push({ coordinate: hitCoordinates, ship: ship, hitAxis: computerRandomAxis });

          return true;
        }

        return false;
      });
    });

    if (!isHit) missedHits.push(hitCoordinates);

    return isHit;
  };

  const allShipsSunk = () => {
    return successfulHits.length === usedShipCoordinates.length;
  };

  const resetBoard = () => {
    ships.length = 0;
    usedShipCoordinates.length = 0;
    missedHits.length = 0;
    successfulHits.length = 0;
    lastHitShip.length = 0;
  };

  return {
    ships,
    missedHits,
    successfulHits,
    lastHitShip,
    placeShip,
    receiveHit,
    allShipsSunk,
    resetBoard,
  };
};

export default createGameBoard;
