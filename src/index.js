import Desmos from 'desmos'
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import gestureModel from './assets/gesture_recognizer.task';

const width = 400;
const height = 600;

const elt = document.createElement('div');
elt.style.width = `100vw`;
elt.style.height = `100vh`;

const calculator = Desmos.GraphingCalculator(elt);
calculator.setMathBounds({
  left: 0,
  right: 1,
  bottom: 0,
  top: 1,
});

document.body.appendChild(elt);

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: gestureModel,
  },
  numHands: 2,
})

const connectors = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
]

gestureRecognizer.setOptions({runningMode: "video"})
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  console.log("stream loaded")
  const video = document.createElement('video');
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    console.log("video loaded")
    video.play();
    gestureRecognizer.setOptions({input: video})
    video.addEventListener('play', () => {
      const render = () => {
        if (video.paused || video.ended) return;
        const results = gestureRecognizer.recognizeForVideo(video, Date.now());
        if (results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          connectors.map(([a, b]) => {
            const pointA = landmarks[a];
            const pointB = landmarks[b];
            calculator.setExpression({
              id: `line-${a}-${b}`,
              latex: `(${pointA.x}(1-t)+${pointB.x}t,(1-t)*${pointA.y}+t*${pointB.y})`,
              parametricDomain: { min: 0, max: 1 },
              color: Desmos.Colors.BLACK,
            })
          })
        }
        requestAnimationFrame(render)
      }
      render()
    })
  }
})