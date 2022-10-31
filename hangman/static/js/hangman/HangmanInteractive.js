/**
 * @type {GallowsGame} GallowsGame
 */
import {GuessResult, default as HangmanSimple} from "./HangmanSimple.js";

/**
 * This class can be used to render the state of a hangman game to show it to a user and let them interact with it.
 */
export default class HangmanInteractive extends HangmanSimple {

    /**
     * Creates a HITGallowsRenderer
     * @param {HTMLDivElement} parent
     */
    constructor(element, images, word, validateLetter) {
        super(word, validateLetter);

        this._images = images;
        this.promise = new Promise((resolve, reject) => {
            this._resolvePromise = resolve;
            // this.reject = reject; // We don't fail like that.
        });

        /**
         * @type {HTMLElement}
         */
        this._gameElement = element;
        this._cleanup();

        this._hitsElement = document.createElement("h1");
        this._missingCountElement = document.createElement("h3");
        this._updateHits();

        this._missesElement = document.createElement("h3");
        this._imgElement = document.createElement("img");
        this._updateImage();

        this._inputElement = document.createElement("input");
        this._inputElement.maxLength = 1;
        this._inputElement.addEventListener("keypress", this.onInput.bind(this));
        this._inputElement.focus();

        this._gameElement.append(this._hitsElement, this._missingCountElement, this._missesElement, this._imgElement, document.createElement("br"), this._inputElement);
    }

    /**
     * @param {KeyboardEvent} event 
     */
    onInput(event) {
        if (event.key == null) return;

        let key = event.key.toLowerCase();
        if (key == "enter") {
            this._guess();
        } else if (!this._isValid(key)) {
            this._inputElement.setCustomValidity(`Character '${key}' is invalid`);
            this._inputElement.reportValidity();
            event.preventDefault();
        } else if (this._wasGuessed(key)) {
            this._inputElement.setCustomValidity(`You already tried '${key}'`);
            this._inputElement.reportValidity();
            event.preventDefault();
        } else {
            this._inputElement.setCustomValidity("");
        }
    }

    _updateHits() {
        this._hitsElement.innerText = this._hits.map(char => char || '_').join('');
        this._missingCountElement.innerText = this._missingCharCount + ' characters missing';
    }

    _updateMisses() {
        this._missesElement.innerText = "You tried: " + this._misses.join(", ");
        this._updateImage();
    }

    _updateImage() {
        this._imgElement.src = this._images[Math.min(this._misses.length, this._images.length - 1)];
    }

    _endGame(wasWon) {
        this._hitsElement.remove();
        this._missingCountElement.remove();
        this._missesElement.remove();
        this._inputElement.remove();

        let revealElement = document.createElement("h2");
        revealElement.innerText = "The word was " + this._word;
        this._gameElement.insertBefore(revealElement, this._gameElement.firstChild);

        let endGameElement = document.createElement("button");
        endGameElement.innerText = "End game";
        endGameElement.addEventListener("click", () => {
            this._resolvePromise(wasWon);
        });
        this._gameElement.appendChild(endGameElement);
    }

    _win() {
        this._endGame(true);
        let winElement = document.createElement("h1");
        this._gameElement.classList.add("won");
        winElement.innerText = "YOU WON";
        this._gameElement.insertBefore(winElement, this._gameElement.firstChild);
    }
    
    _lose() {
        this._endGame(false);
        let loseElement = document.createElement("h1");
        this._gameElement.classList.add("lost");
        loseElement.innerText = "You lost...";
        this._gameElement.insertBefore(loseElement, this._gameElement.firstChild);
    }

    _cleanup() {
        while (this._gameElement.firstChild != null)
            this._gameElement.removeChild(this._gameElement.firstChild);
        this._gameElement.classList.remove("won", "lost");
    }

    _guess() {
        if (this._inputElement.value.length == 0) {
            this._inputElement.setCustomValidity("Missing input");
            this._inputElement.reportValidity();
            return;
        }

        var result = this.guessCharacter(this._inputElement.value);
        switch (result) {
            case GuessResult.WON:
                this._win();
            case GuessResult.HIT:
                this._updateHits();
                break;
            case GuessResult.MISS:
                this._updateMisses();
                console.log(this);
                if (this._misses.length >= this._images.length - 1) {
                    this._lose();
                }
                break;
            default:
                break;
        }

        this._inputElement.value = "";
    }
}