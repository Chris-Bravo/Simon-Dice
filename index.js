import useStore from './store.js';

const startButton = document.getElementById('startButton');
const yellowButton = document.getElementById('yellowButton');
const blueButton = document.getElementById('blueButton');
const greenButton = document.getElementById('greenButton');
const redButton = document.getElementById('redButton');
const gameLevel = document.getElementById('gameLevel');
const gameScore = document.getElementById('gameScore');

const LEVEL_GROWTH_RATE = 4;
const COLORS = {
  yellow: 0,
  blue: 1,
  red: 2,
  green: 3,
};

const GAME_BUTTONS_BY_COLOR = {
  yellow: yellowButton,
  blue: blueButton,
  green: greenButton,
  red: redButton,
};

const { subscribe, dispatch, getState } = useStore();

subscribe(() => {
  gameLevel.innerText = getState().currentLevel;
  gameScore.innerText = getState().highScore;
});

const initGameListeners = () => {
  startButton.addEventListener('click', startGame);

  Object.values(GAME_BUTTONS_BY_COLOR).forEach((button) => {
    button.addEventListener('click', onGameButtonClick);
  });
};

const restartGameState = () => {
  showStartButton();
  disableGameButtons();
};

const startGame = () => {
  const newSequence = generateNewSequence();

  dispatch({
    type: 'START_GAME',
    payload: {
      currentLevel: 1,
      colorSequenceInGame: newSequence,
    },
  });

  hideStartButton();
  setTimeout(nextSublevel, 1000);
};

const nextLevel = () => {
  dispatch({
    type: 'NEXT_LEVEL',
  });

  swal('Amazing!', {
    icon: 'success',
    buttons: false,
    timer: 800,
  });

  setTimeout(nextSublevel, 1500);
};

const nextSublevel = () => {
  dispatch({
    type: 'RESET_SUBLEVEL',
  });

  disableGameButtons();
  iluminateSequence();
};

const iluminateSequence = () => {
  const { currentLevel, colorSequenceInGame } = getState();

  for (let i = 0; i < currentLevel; i++) {
    const sequenceNumber = colorSequenceInGame[i];
    const color = getColorByNumber(sequenceNumber);
    const delay = 1000 * i;

    setTimeout(turnOnButtonByColor, delay, color);

    // Enable buttons after the last button turned on
    if (i === currentLevel - 1) {
      setTimeout(enableGameButtons, delay);
    }
  }
};

const onGameButtonClick = ($event) => {
  const { color } = $event.target.dataset;
  const { sublevel, colorSequenceInGame } = getState();
  const currentButtonNumber = getNumberByColor(color);
  const sublevelSequenceNumber = colorSequenceInGame[sublevel];

  turnOnButtonByColor(color, 200);

  if (currentButtonNumber === sublevelSequenceNumber) {
    checkIfUserCompleteLevel();
    return;
  }

  displayGameOverNotification();
};

const checkIfUserCompleteLevel = () => {
  dispatch({
    type: 'INCREASE_SUBLEVEL',
  });

  const userCompleteLevel = getState().sublevel === getState().currentLevel;
  const userCompleteLastLevel =
    getState().currentLevel === getState().colorSequenceInGame.length;

  if (userCompleteLevel && userCompleteLastLevel) {
    const newSequence = generateNewSequence();

    // TODO: Think best way to create Infinite mode for game
    dispatch({
      type: 'UPDATE_SEQUENCE',
      payload: {
        newSequence,
      },
    });
  }

  if (userCompleteLevel) {
    nextLevel();
    return;
  }
};

const generateNewSequence = () => {
  const newSequence = new Array(LEVEL_GROWTH_RATE)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 4));

  return newSequence;
};

const getButtonByColor = (color) => GAME_BUTTONS_BY_COLOR[color];

const getColorByNumber = (number) => {
  const color = Object.keys(COLORS).filter((color) => COLORS[color] === number);

  return color[0];
};

const getNumberByColor = (color) => COLORS[color];

const turnOnButtonByColor = (color, duration = 300) => {
  const button = getButtonByColor(color);
  button.classList.add('light');

  setTimeout(turnOffButtonByColor, duration, color);
};

const turnOffButtonByColor = (color) => {
  const button = getButtonByColor(color);
  button.classList.remove('light');
};

const enableGameButtons = () => {
  Object.values(GAME_BUTTONS_BY_COLOR).forEach((button) => {
    button.classList.remove('disable-button');
  });
};

const disableGameButtons = () => {
  Object.values(GAME_BUTTONS_BY_COLOR).forEach((button) =>
    button.classList.add('disable-button'),
  );
};

const hideStartButton = () => {
  startButton.classList.add('hide');
};

const showStartButton = () => {
  startButton.classList.remove('hide');
};

const displayWinnerNotification = () => {
  swal('You won!', 'Congratulations, you won the game!', 'success').then(
    restartGameState,
  );
};

const displayGameOverNotification = () => {
  //TODO: Create own swal alert
  swal('You lost!', 'We are sorry, you lost :(', 'error').then(
    restartGameState,
  );
};

initGameListeners();
