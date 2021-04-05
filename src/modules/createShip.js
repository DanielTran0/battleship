const createShip = (length, name) => {
  const hitLocations = [];

  const hit = (x, y) => {
    hitLocations.push({ x: x, y: y });
  };

  const isSunk = () => {
    return hitLocations.length === length;
  };

  return { length, name, hitLocations, hit, isSunk };
};

export default createShip;
