import { saveData, getDataFor } from './localstorage.js';

function createStore(initialState) {
    let state = initialState;
  
    function setState(newState) {
      state = { ...state, ...newState };
      checkHighScoreToSaveIt(state.score);
      state.highScore = getSavedScore();
    }
  
    function getState() {
      return state;
    }
  
    return () => {
      return [getState, setState];
    };
}

const store = createStore({
  currentLevel: 1,
  sublevel: 0,
  colorSequence: [],
  highScore: getSavedScore(),
  score: 0,
});

function checkHighScoreToSaveIt (score) {
  const data = getDataFor('simon');
  if (data && data.highScore) {
    const needsSave = score > data.highScore;

    if (needsSave) {
      saveData('simon', { highScore: score });
    }

    return;
  }
  
  saveData('simon', { highScore: score });
}

function getSavedScore () {
  const data = getDataFor('simon');
  if (data && data.highScore) {
    return data.highScore;
  }
  return 0;
}

export default store;

  