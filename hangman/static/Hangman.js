"use strict";

export const VALID_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
export const GuessResult = Object.freeze({
    HIT: "hit",
    MISS: "miss",
    ALREADY_TRIED: "already tried",
    INVALID: "invalid"
});

/**
 * This class will track the state of a hangman game and allows you to easily guess a character.
 * Can be combined with a gallows interactive to visualize the game state on a webpage and allow a user to interact with it.
 * @property {String} hits
 * @property {Array<String>} misses
 */
export default class GallowsGame {

    static get validCharacters() {
        return VALID_CHARACTERS;
    }

    /**
     * Creates a new game manager for Hangman using the provided string as the word to be guessed
     * @param {String} word
     */
    constructor(word, maxMisses) {
        this.word = word.toLowerCase();
        this.hits = new Array(word.length).fill(null);
        /** @type {String[]} */
        this.misses = []; // Store guessed characters that didn't match the string in a list and use size to determine game progression.
        this.maxMisses = maxMisses;
    }

    /**
     * Lets you guess a character. Updates the state of the game.
     * @param {String} character
     */
    guessCharacter(character) {
        if (!this.isValid(character)) {
            return GuessResult.INVALID;
        } else if (this.wasGuessed(character)) {
            return GuessResult.ALREADY_TRIED;
        } else {
            let charIsHit = false;
            for (let index in this.word) {
                if (this.word[index] == character) {
                    charIsHit = true;
                    this.hits[index] = character;
                }
            }

            if (charIsHit) {
                return GuessResult.HIT;
            } else {
                this.misses.push(character);
                return GuessResult.MISS;
            }
        }
    }

    get isWon() {
        return this.hits.every(hit => hit != null);
    }

    get isLost() {
        return this.misses.length >= this.maxMisses;
    }

    get missingCharCount() {
        return this.hits.filter((hit) => hit == null).length;
    }

    /**
     * @param {String} character - The character to validate. Must be 1 long.
     * @returns {boolean} Whether the passed character was valid.
     */
    isValid(character) {
        return typeof character == "string"
            && character.length == 1
            && GallowsGame.validCharacters.includes(character);
    }

    wasGuessed(character) {
        return this.misses.includes(character) || this.hits.includes(character);
    }
}

// /**
//  * @todo Move global variable to play() scope to prevent cheating.
//  * CONDITION: Be done with debugging.
//  */
// let game;