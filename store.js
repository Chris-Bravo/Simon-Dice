// TODO: Implements localstorage logic to save last score;

function createStore(initialState) {
    let state = initialState;
  
    function setState(newState) {
      state = { ...state, ...newState };
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
  highScore: 0
});

export default store;

  