import createGameBoard from '../modules/createGameBoard';
import gameController from '../modules/gameController';
import createShip from '../modules/createShip';

test('valid player 1 move', () => {
  const gameBoard1 = createGameBoard();
  const gameBoard2 = createGameBoard();

  gameBoard1.placeShip(createShip(3), 5, 5, 'r');
  gameBoard2.placeShip(createShip(3), 1, 2, 'u');

  expect(gameController.playerMove(gameBoard2, 1, 4)).toBe(true);
});

test('invalid player 1 move', () => {
  const gameBoard1 = createGameBoard();
  const gameBoard2 = createGameBoard();

  gameBoard1.placeShip(createShip(3), 5, 5, 'r');
  gameBoard2.placeShip(createShip(3), 1, 2, 'u');

  expect(gameController.playerMove(gameBoard2, 1, 6)).toBe(false);
});

test('valid computer move', () => {
  const gameBoard1 = createGameBoard();
  const gameBoard2 = createGameBoard();

  gameBoard1.placeShip(createShip(3), 5, 5, 'r');
  gameBoard2.placeShip(createShip(3), 1, 2, 'u');

  expect(gameController.computerMove(gameBoard2)).toBe(false);
});

test('random ship placement', () => {
  const gameBoard = createGameBoard();
  expect(gameController.randomizeShipLocations(gameBoard)).toBe(true);
});

test('random ship placement multiple time', () => {
  const gameBoard = createGameBoard();
  gameController.randomizeShipLocations(gameBoard);
  gameController.randomizeShipLocations(gameBoard);
  gameController.randomizeShipLocations(gameBoard);
  expect(gameBoard.ships.length).toBe(5);
});
