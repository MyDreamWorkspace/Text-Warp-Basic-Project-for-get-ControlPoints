import Draggable from 'gsap/Draggable';

const moveCanvas = (movingElement) => {
  const canvasDrag = Draggable.create(movingElement, {
    trigger: document.getElementById("previewsContainer"),
    cursor: 'auto',
  });

  canvasDrag[0].enable();
  document.body.style.cursor = 'grab';
  // "SPACE" KEY PRESSED
  document.addEventListener('keydown', function (e) {
      // canvasDrag[0].enable();
      // document.body.style.cursor = 'grab';
  });

  document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
      // canvasDrag[0].disable();
      // document.body.style.cursor = 'default';
    }
  });
};

export default moveCanvas;
