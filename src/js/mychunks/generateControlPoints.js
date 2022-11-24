const generateControlPoints = (width, height, offsetX, offsetY,
  numberOfLeft = 10,
  numberOfBottom = 10,
  numberOfRight = 10,
  numberOfTop = 10) => {
  let checkAndRoundNumber = (length, index, offset, number) => (length / number) * index + offset;
  let myLeft =[...Array(numberOfLeft).keys()]
    .map((item, i) => [offsetX, checkAndRoundNumber(height, i, offsetY, numberOfLeft)]);
  let myBottom = [...Array(numberOfBottom).keys()]
    .map((item, i) => [checkAndRoundNumber(width, i, offsetX, numberOfBottom), offsetY + height]);
  let myRight = [...Array(numberOfRight).keys()]
    .map((item, i) => [width + offsetX, checkAndRoundNumber(height, ++i, offsetY, numberOfRight)])
    .reverse();
  let myTop = [...Array(numberOfTop).keys()]
    .map((item, i) => [checkAndRoundNumber(width, ++i, offsetX, numberOfTop), offsetY])
    .reverse();

  return [...myLeft, ...myBottom, ...myRight, ...myTop];
};

export default generateControlPoints;

