import createShip from '../modules/createShip';

test('ship length', () => {
  expect(createShip(10)).toHaveProperty('length', 10);
});

test('ship hit locations', () => {
  const ship = createShip(2);
  ship.hit(10, 5);
  expect(ship).toHaveProperty('hitLocations', [{ x: 10, y: 5 }]);
});

test('ship not sunk', () => {
  expect(createShip(1).isSunk()).toBe(false);
});

test('ship sunk', () => {
  const ship = createShip(5);
  ship.hit(10, 2);
  ship.hit(11, 3);
  ship.hit(1, 2);
  ship.hit(9, 1);
  ship.hit(10, 1);
  expect(ship.isSunk()).toBe(true);
});
