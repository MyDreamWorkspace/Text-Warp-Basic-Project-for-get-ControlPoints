import TextToSVG from 'text-to-svg';

const textToSvg = (text, font = "../../font/Oswald-Bold.ttf") => {
  const attributes = {
    fill: 'black'
  };
  const options = {
    x: 0,
    y: 72,
    fontSize: 400,
    anchor: 'left baseline',
    kerning: false,
    attributes: attributes
  };

  let textToSVG;
  let svg;
  return new Promise(function (resolve, reject) {
    TextToSVG.load(font, (err, t2s) => {
      if (err) {
        return reject(err);
      }
      textToSVG = t2s;
      svg = textToSVG.getSVG(text, options);
      resolve(svg);
    });
  });
};

export default textToSvg;
