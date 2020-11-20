import { saveData, getDataFor } from './localstorage.js';

function createStore (reducer, initialState) {

  let state = initialState;
  let notify = () => {};

  function subscribe (callback) {
    notify = callback;
  }

  function dispatch (action) {
    state = reducer(state, action);
    notify();
  }

  function getState () {
    return state;
  }

  return () => ({
    subscribe,
    dispatch,
    getState,
  })

}

// TODO: Refactoring reducer
function reducer (state, action) {

  const { type, payload } = action;

  switch (type) {
    case 'START_GAME':
      return {
        ...state,
        ...payload,
      }
    case 'NEXT_LEVEL':

      const newState = {
        ...state,
        score: state.currentLevel,
        currentLevel: state.currentLevel + 1
      }

      if (newState.score > newState.highScore) {
        saveData('simon', { highScore: score });
        newState.highScore = newState.score;
      }

      return newState;

    case 'RESET_SUBLEVEL':
      return {
        ...state,
        sublevel: 0,
      }
    case 'INCREASE_SUBLEVEL':
      return {
        ...state,
        sublevel: state.sublevel + 1
      }
    case 'UPDATE_SEQUENCE':
      return {
        ...state,
        colorSequenceInGame: [...state.colorSequenceInGame, ...payload.newSequence]
      }
    default:
      return state;
  }
}

const store = createStore(reducer, {
  currentLevel: 1,
  sublevel: 0,
  colorSequence: [],
  highScore: getSavedScore(),
  score: 0,
})

function getSavedScore () {
  const data = getDataFor('simon');
  if (data && data.highScore) {
    return data.highScore;
  }
  return 0;
}

export default store;

  