import createGameBoard from '../modules/createGameBoard';
import createShip from '../modules/createShip';

test('ship placement up', () => {
  const game = createGameBoard();
  const ship = createShip(3);
  game.placeShip(ship, 4, 5, 'u');

  expect(game.ships).toEqual([
    {
      details: ship,
      coordinates: [
        { x: 4, y: 5 },
        { x: 4, y: 6 },
        { x: 4, y: 7 },
      ],
    },
  ]);
});

test('ship placement right', () => {
  const game = createGameBoard();
  const ship = createShip(4);
  game.placeShip(ship, 6, 9, 'r');

  expect(game.ships).toEqual([
    {
      details: ship,
      coordinates: [
        { x: 6, y: 9 },
        { x: 7, y: 9 },
        { x: 8, y: 9 },
        { x: 9, y: 9 },
      ],
    },
  ]);
});

test('valid ship placement in boundary', () => {
  const game = createGameBoard();
  expect(game.placeShip(createShip(3), 4, 5, 'r')).toBe(true);
});

test('not valid ship placement in boundary, placed over', () => {
  const game = createGameBoard();
  expect(game.placeShip(createShip(1), 8, 11, 'u')).toBe(false);
});

test('not valid ship placement in boundary, placed under', () => {
  const game = createGameBoard();
  expect(game.placeShip(createShip(5), -1, 8, 'u')).toBe(false);
});

test('not valid ship placement in boundary, exceeds', () => {
  const game = createGameBoard();
  expect(game.placeShip(createShip(7), 6, 6, 'u')).toBe(false);
});

test('ship placement collision happens', () => {
  const game = createGameBoard();
  game.placeShip(createShip(5), 1, 3, 'r');
  expect(game.placeShip(createShip(2), 3, 3, 'r')).toBe(false);
});

test('ship placement collision does not happen', () => {
  const game = createGameBoard();
  game.placeShip(createShip(5), 5, 5, 'r');
  expect(game.placeShip(createShip(1), 3, 3, 'r')).toBe(true);
});

test('receive successful hit', () => {
  const game = createGameBoard();
  game.placeShip(createShip(4), 1, 2, 'u');
  expect(game.receiveHit(1, 5)).toBe(true);
});

test('receive successful hit, ship hit locations', () => {
  const game = createGameBoard();
  game.placeShip(createShip(2), 10, 9, 'u');
  game.receiveHit(10, 10);
  expect(game.ships[0].details.hitLocations).toEqual([{ x: 10, y: 10 }]);
});

test('receive missed hit', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  expect(game.receiveHit(7, 7)).toBe(false);
});

test('missed hit stored', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  game.receiveHit(7, 7);
  expect(game.missedHits).toEqual([{ x: 7, y: 7 }]);
});

test('reject duplicate hit', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  game.receiveHit(7, 7);
  expect(game.receiveHit(7, 7)).toBe(null);
});

test('all ships sunk, true', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  game.receiveHit(5, 5);
  game.receiveHit(5, 6);
  game.receiveHit(5, 7);
  expect(game.allShipsSunk()).toBe(true);
});

test('all ships sunk, false', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  game.placeShip(createShip(2), 1, 1, 'r');
  game.receiveHit(5, 5);
  game.receiveHit(5, 6);
  game.receiveHit(5, 7);
  expect(game.allShipsSunk()).toBe(false);
});

test('reset gameBoard', () => {
  const game = createGameBoard();
  game.placeShip(createShip(3), 5, 5, 'u');
  game.placeShip(createShip(2), 1, 1, 'r');
  game.receiveHit(5, 5);
  game.receiveHit(5, 6);
  game.receiveHit(5, 7);
  game.resetBoard();
  expect(game).toEqual({
    ships: [],
    missedHits: [],
    successfulHits: [],
    placeShip: game.placeShip,
    receiveHit: game.receiveHit,
    allShipsSunk: game.allShipsSunk,
    resetBoard: game.resetBoard,
  });
});
