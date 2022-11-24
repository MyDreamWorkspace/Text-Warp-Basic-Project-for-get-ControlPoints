const generateGridPoints = (width, height, offsetX, offsetY, amount)=>{
  const sideNumber = amount /4;
    const checkAndRoundNumber = (length, index, offset) => (length / sideNumber) * index + offset;
    // const testcheckAndRoundNumber = (length, index, offset) => (length / (sideNumber + 10)) * index + offset;
    const myArray = [...Array(sideNumber).keys()];
    // const testArray = [...Array(sideNumber + 10).keys()];
    const myLeft =myArray.map((item, i) => [offsetX, checkAndRoundNumber(height, i, offsetY)]);
    // const myLeft = testArray.map((item, i) => [offsetX, testcheckAndRoundNumber(height, i, offsetY)]);

    const myBottom = myArray.map((item, i) => [checkAndRoundNumber(width, i, offsetX), offsetY + height]);

    const myRight = myArray
      .map((item, i) => [width + offsetX, checkAndRoundNumber(height, ++i, offsetY)])
      .reverse();

    const myTop = [...Array(sideNumber).keys()]
      .map((item, i) => [checkAndRoundNumber(width, ++i, offsetX), offsetY])
      .reverse();

    return [...myLeft, ...myBottom, ...myRight, ...myTop];
};

export default generateGridPoints;

