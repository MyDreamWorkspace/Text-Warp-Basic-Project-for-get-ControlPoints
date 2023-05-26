import Draggable from 'gsap/Draggable';

const moveCanvas = (movingElement) => {
  const canvasDrag = Draggable.create(movingElement, {
    trigger: document.getElementById("previewsContainer"),
    cursor: 'auto',
  });

  canvasDrag[0].enable();
  document.body.style.cursor = 'grab';

  // canvasDrag[0].disable();
  //
  // // "SPACE" KEY PRESSED
  // document.addEventListener('keydown', function (e) {
  //   if (e.code === 'Space') {
  //     canvasDrag[0].enable();
  //     document.body.style.cursor = 'grab';
  //   }
  // });
};

export default moveCanvas;
