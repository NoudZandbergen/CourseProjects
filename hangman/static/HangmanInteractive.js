/**
 * @type {GallowsGame} GallowsGame
 */
import {GuessResult, default as GallowsGame} from "./Hangman.js";

/**
 * This class can be used to render the state of a hangman game to show it to a user and let them interact with it.
 */
export default class HITGallowsInteractive {

    /**
     * Creates a HITGallowsRenderer
     * @param {HTMLDivElement} element 
     * @param {Function<GallowsGame>} gameGenerator
     */
    constructor(element, gameGenerator, images) {
        // if (!(element instanceof HTMLDivElement)) throw Error(`Argument "element" must be an instance of "${HTMLDivElement.name}". Got ${element} instead.`);
        // if (!(gameGenerator instanceof GallowsGame)) throw Error(`Argument "game" must be an instance of "${GallowsGame.name}". Got ${game} instead.`);

        this.gameElement = element;
        this.gameGenerator = gameGenerator;
        this.images = images;

        this.initGame();
    }

    /**
     * Attaches elements to the game to make it render and interactive.
     */
    initGame() {
        /** @type {GallowsGame} */
        this.game = this.gameGenerator();

        // Clear children
        while (this.gameElement.firstChild != null) {
            this.gameElement.removeChild(this.gameElement.firstChild);
        }
        this.hitsElement = document.createElement("h1");
        this.missingCountElement = document.createElement("h3");
        this.updateHits();

        this.missesElement = document.createElement("h3");
        this.imgElement = document.createElement("img");
        this.updateImage();

        this.inputElement = document.createElement("input");
        this.inputElement.maxLength = 1;
        this.inputElement.addEventListener("keypress", this.onInput.bind(this));

        this.gameElement.append(this.hitsElement, this.missingCountElement, this.missesElement, this.imgElement, document.createElement("br"), this.inputElement);
    }

    /**
     * @param {KeyboardEvent} event 
     */
    onInput(event) {
        if (event.key == null) return;

        let key = event.key.toLowerCase();
        if (key == "enter") {
            this.guess();
        } else if (!this.game.isValid(key)) {
            this.inputElement.setCustomValidity(`Character '${key}' is invalid`);
            this.inputElement.reportValidity();
            event.preventDefault();
        } else if (this.game.wasGuessed(key)) {
            this.inputElement.setCustomValidity(`You already tried '${key}'`);
            this.inputElement.reportValidity();
            event.preventDefault();
        } else {
            this.inputElement.setCustomValidity("");
        }
    }

    updateHits() {
        this.hitsElement.innerText = this.game.hits.map(char => char || '_').join('');
        this.missingCountElement.innerText = this.game.missingCharCount + ' characters missing';
    }

    updateMisses() {
        this.missesElement.innerText = "You tried: " + this.game.misses.join(", ");
        this.updateImage();
    }

    updateImage() {
        this.imgElement.src = this.images[Math.min(this.game.misses.length, this.images.length - 1)];
    }

    endGame() {
        this.hitsElement.remove();
        this.missesElement.remove();
        this.missingCountElement.remove();
        this.inputElement.remove();

        let revealElement = document.createElement("h2");
        revealElement.innerText = "The word was " + this.game.word;
        this.gameElement.insertBefore(revealElement, this.gameElement.firstChild);

        let resetElement = document.createElement("button");
        resetElement.innerText = "Restart";
        resetElement.addEventListener("click", () => {
            this.initGame();
        });
        this.gameElement.appendChild(resetElement);
    }

    win() {
        this.endGame();
        let wonElement = document.createElement("h1");
        wonElement.innerText = "You won!";

        this.gameElement.insertBefore(wonElement, this.gameElement.firstChild);
    }

    lose() {
        this.endGame();
        let lostElement = document.createElement("h1");
        lostElement.innerText = "You lost!";

        this.gameElement.insertBefore(lostElement, this.gameElement.firstChild);
    }

    guess() {
        if (this.inputElement.value.length == 0) {
            this.inputElement.setCustomValidity("Missing input");
            this.inputElement.reportValidity();
            event.preventDefault();
            return;
        }

        var result = this.game.guessCharacter(this.inputElement.value);
        switch (result) {
            case GuessResult.HIT:
                this.updateHits();
                if (this.game.isWon) {
                    this.win();
                }
                break;
            case GuessResult.MISS:
                this.updateMisses();
                if (this.game.isLost) {
                    this.lose();
                }
                break;
            default:
                break;
        }

        this.inputElement.value = "";
    }
}