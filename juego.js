import useStore from './store.js';

const startButton = document.getElementById('startButton');
const yellowButton = document.getElementById('yellowButton');
const blueButton = document.getElementById('blueButton');
const greenButton = document.getElementById('greenButton');
const redButton = document.getElementById('redButton');
const gameLevel = document.getElementById('gameLevel');

const FINAL_LEVEL = 4;
const COLORS = {
  yellow: 0,
  blue: 1,
  green: 2,
  red: 3,
};

const GAME_BUTTONS_BY_COLOR = {
  yellow: yellowButton,
  blue: blueButton,
  green: greenButton,
  red: redButton,
};

function initListeners () {
  startButton.addEventListener('click', startGame);

  Object.values(GAME_BUTTONS_BY_COLOR).forEach(button => {
    button.addEventListener('click', onColorButtonClick),
    button.classList.add('disable-button');
  });
}

const [getState, setState] = useStore();

function generateNewSequence () {
  const newSequence = new Array(FINAL_LEVEL)
    .fill(0)
    .map(_ => Math.floor(Math.random() * 4));

  return newSequence;
}

function getButtonByColor (color) {
  return GAME_BUTTONS_BY_COLOR[color];
}

function hideStartButton () {
  startButton.classList.add('hide');
}

function showStartButton () {
  startButton.classList.remove('hide');
}

function getColorByNumber (number) {
  const color = Object.keys(COLORS).filter(color => COLORS[color] === number);
  return color[0];
}

function getNumberByColor (color) {
  return COLORS[color];
}

function updateDOM () {
  gameLevel.innerText = getState().currentLevel;
}

function iluminateSequence () {
  const { currentLevel, colorSequenceInGame } = getState();

  for (let i = 0; i < currentLevel; i++) {
    const color = getColorByNumber(colorSequenceInGame[i]);
    const delay = 1000 * i;

    setTimeout(turnOnButtonByColor, delay, color);

    // Enable buttons after the last button turned on
    if (i === currentLevel - 1) {
      setTimeout(enableGameButtons , delay);
    }
  }
}

function turnOnButtonByColor (color, duration = 300) {
  const button = getButtonByColor(color);
  button.classList.add('light');

  setTimeout(turnOffButtonByColor, duration, color);
}

function turnOffButtonByColor (color) {
  const button = getButtonByColor(color);
  button.classList.remove('light');
}

function enableGameButtons () {
  Object.values(GAME_BUTTONS_BY_COLOR).forEach(button => {
    button.classList.remove('disable-button');
  });
}

function disableGameButtons () {
  Object.values(GAME_BUTTONS_BY_COLOR).forEach(button =>
    button.classList.add('disable-button')
  );
}

function onColorButtonClick ($event) {
  const { color } = $event.target.dataset;
  const { sublevel, colorSequenceInGame } = getState();
  const colorNumber = getNumberByColor(color);

  turnOnButtonByColor(color, 200);

  if (colorNumber === colorSequenceInGame[sublevel]) {
    setState({ sublevel: getState().sublevel + 1 });

    if (getState().sublevel === getState().currentLevel) {
      if (getState().currentLevel === FINAL_LEVEL) {
        winner();
      } else {
        setState({ currentLevel: getState().currentLevel + 1 });
        passNextLevel();
      }
    }
  } else {
    gameOver();
  }
}

function passNextLevel () {
  swal('Muy bien', {
    icon: 'success',
    buttons: false,
    timer: 800,
  });
  updateDOM();
  setTimeout(nextLevel, 1500);
}

function nextLevel () {
  setState({ sublevel: 0 });
  disableGameButtons();
  iluminateSequence();
}

function winner () {
  swal('Ganaste!', 'Felicitaciones, ganaste el juego!', 'success').then(
    restartGameState,
  );
}

function gameOver () {
  swal('Perdiste!', 'Lo lamentamos, perdiste :(', 'error').then(
    restartGameState,
  );
}

function restartGameState () {
  showStartButton();
  disableGameButtons();
}

function startGame () {
  const newSequence = generateNewSequence();
  setState({
    currentLevel: 1,
    sublevel: 0,
    colorSequenceInGame: newSequence,
  });

  updateDOM();
  hideStartButton();
  setTimeout(nextLevel, 1000);
}

initListeners();
