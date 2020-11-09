const startButton = document.getElementById('startButton');
const yellowButton = document.getElementById('yellowButton');
const blueButton = document.getElementById('blueButton');
const greenButton = document.getElementById('greenButton');
const redButton = document.getElementById('redButton');
const gameLevel = document.getElementById('gameLevel');

const FINAL_LEVEL = 4;
const COLORS =  {
    'yellow': 0,
    'blue': 1,
    'green': 2,|
    'red': 3
}

const GAME_BUTTONS_BY_COLOR = {
    yellow: yellowButton,
    blue: blueButton,
    green: greenButton,
    red: redButton
};

class SimonSays {
    
    constructor () {
        this.addClickListenerToButtons = this.addClickListenerToButtons.bind(this);
        this.onColorButtonClick = this.onColorButtonClick.bind(this);
        this.turnOffButtonByColor = this.turnOffButtonByColor.bind(this);
        this.turnOnButtonByColor = this.turnOnButtonByColor.bind(this);
        this.restartGameState = this.restartGameState.bind(this);
        this.nextLevel = this.nextLevel.bind(this);

        this.initGame();
    }
    
    initGame () {
        this.currentLevel = 1;
        this.updateDOM();
        this.generateNewSequence();
        this.hideStartButton();

        setTimeout(this.nextLevel, 1000);
    }
    
    generateNewSequence () {
        this.colorSequenceInGame = new Array(FINAL_LEVEL).fill(0).map(_ => Math.floor(Math.random() * 4));
    }

    hideStartButton () {
        startButton.classList.add('hide');
    }

    displayStartButton () {
        startButton.classList.remove('hide');
    }

    getColorByNumber (number) {
        const color = Object.keys(COLORS).filter(color => COLORS[color] === number);

        return color[0];
    }

    getNumberByColor (color) {
        return COLORS[color];
    }

    updateDOM () {
        gameLevel.innerText = this.currentLevel;
    }

    iluminateSequence () {
        for (let i = 0; i < this.currentLevel; i++) {
            const color = this.getColorByNumber(this.colorSequenceInGame[i]);
            const delay = 1000 * i;

            setTimeout(this.turnOnButtonByColor, delay, color);

            // Enable buttons after the last button turned on
            if (i === this.currentLevel - 1) {
                setTimeout(this.addClickListenerToButtons, delay);
            }
        }

    }

    turnOnButtonByColor (color, duration = 300) {
        const button = GAME_BUTTONS_BY_COLOR[color];
        button.classList.add('light','animations');

        setTimeout(this.turnOffButtonByColor, duration, color);
    }

    turnOffButtonByColor (color) {
        const button = GAME_BUTTONS_BY_COLOR[color];
        button.classList.remove('light','animations');
    }

    addClickListenerToButtons () {
        Object.values(GAME_BUTTONS_BY_COLOR).forEach(button => button.addEventListener('click', this.onColorButtonClick));
    }

    removeClickListenerToButtons () {
        Object.values(GAME_BUTTONS_BY_COLOR).forEach(button => button.removeEventListener('click', this.onColorButtonClick));
    }

    onColorButtonClick ($event) {
        const { color } = $event.target.dataset;
        const colorNumber = this.getNumberByColor(color);

        this.turnOnButtonByColor(color, 200);

        if (colorNumber === this.colorSequenceInGame[this.sublevel]) {
            this.sublevel++;

            if (this.sublevel === this.currentLevel) {
                this.currentLevel++;

                if (this.currentLevel === FINAL_LEVEL) {
                    this.winner();
                } else {
                    this.passToNextLevel();
                }
            }
        } else {
            this.gameOver();
        }
    }

    passToNextLevel () {
        swal('Muy bien',{
            icon: 'success',
            buttons: false,
            timer: 800
        });
        this.updateDOM();
        setTimeout(this.nextLevel, 1500);
    }

    nextLevel () {
        this.sublevel = 0;
        this.removeClickListenerToButtons();
        this.iluminateSequence();
    }

    winner () {
        swal('Ganaste!','Felicitaciones, ganaste el juego!','success').then(this.restartGameState);
    }
    
    gameOver () {
        swal('Perdiste!','Lo lamentamos, perdiste :(','error').then(this.restartGameState);
    }

    restartGameState () {
        this.displayStartButton();
        this.removeClickListenerToButtons();
    }
}

function startGame () {
    if (window.juego) {
        window.juego.initGame();
    } else {
        window.juego = new SimonSays();
    }
}

// function factoryUseState() {
//     let state;

//     function setState(callback) {
//         state = callback(state) || state;
//     }

//     function getState() {
//         return state;
//     }

//     return (initialState) => {
//         state = initialState;

//         return [getState, setState];
//     }
// }

// const useState = factoryUseState();
// const [getState, setState] = useState({ level: 0, sublevel: 0 });

// console.log(getState())

// setState((state) => {
//     console.log(state);
// });

// console.log(getState());

// setState((state) => ({
//     newValue: 0,
//     level: 1,
//     sublevel: state.sublevel++,
// }));

// console.log(getState());