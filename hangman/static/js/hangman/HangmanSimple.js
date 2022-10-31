"use strict";

export const GuessResult = Object.freeze({
    HIT: "hit",
    MISS: "miss",
    ALREADY_TRIED: "already tried",
    INVALID: "invalid",
    WON: "won"
});

/**
 * @typedef {Function} ValidateCharacter
 * @param {String} string
 * @returns {Boolean}
 */

/**
 * This class will track the state of a hangman game and allows you to easily guess a character.
 * Can be combined with a gallows interactive to visualize the game state on a webpage and allow a user to interact with it.
 * @property {String} hits
 * @property {Array<String>} misses
 */
export default class HangmanSimple {

    /**
     * Creates a new game manager for Hangman using the provided string as the word to be guessed
     * @param {String} word The word that has to be guessed
     * @param {ValidateCharacter} validate Whether an input character is valid
     */
    constructor(word, validate) {
        this._word = word.toLowerCase();
        this._hits = new Array(word.length).fill(null);

        /** @type {String[]} */
        this._misses = []; // Store guessed characters that didn't match the string in a list and use size to determine game progression.
        this._validate = validate;
    }

    /**
     * Lets you guess a character. Updates the state of the game.
     * @param {String} character
     * @returns {String}
     */
    guessCharacter(character) {
        if (!this._isValid(character)) {
            return GuessResult.INVALID;
        } else if (this._wasGuessed(character)) {
            return GuessResult.ALREADY_TRIED;
        } else {
            let charIsHit = false;
            for (let index in this._word) {
                if (this._word[index] == character) {
                    charIsHit = true;
                    this._hits[index] = character;
                }
            }

            if (charIsHit) {
                if (this._hits.every(hit => hit != null)) return GuessResult.WON;
                return GuessResult.HIT;
            } else {
                this._misses.push(character);
                return GuessResult.MISS;
            }
        }
    }

    get _missingCharCount() {
        return this._hits.filter((hit) => hit == null).length;
    }

    /**
     * @param {String} character - The character to validate. Must be 1 long.
     * @returns {boolean} Whether the passed character was valid.
     */
    _isValid(character) {
        return typeof character == "string"
            && character.length == 1
            && this._validate(character);
    }

    _wasGuessed(character) {
        return this._misses.includes(character) || this._hits.includes(character);
    }
}

// /**
//  * @todo Move global variable to play() scope to prevent cheating.
//  * CONDITION: Be done with debugging.
//  */
// let game;