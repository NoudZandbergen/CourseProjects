"use strict";

import HangmanInteractive from "./js/hangman/HangmanInteractive.js";

/**
 * @returns {Promise<String>} Promise resolving with the word that was fetched
 */
export async function fetchWordFromVercelApi() {
    const res = await fetch("https://random-words-api.vercel.app/word/dutch");
    const data = await res.json();
    return data[0].word;
}

async function fetchImageAsBlob(path) {
    return fetch(path)
        .then(res => res.blob())
        .then(URL.createObjectURL);
}

async function fetchImages() {
    let steps = await fetch("/images.json").then(res => res.json());

    let result = {};
    Promise.all(steps.map(async images => {
        result[images.length] = await Promise.all(images.map(fetchImageAsBlob));
    }));

    return result;
}

export const VALID_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

/**
 * This will turn all div elements with class "hangman" into game instances.
 * To add instances later, do so manually by creating a HITGallowsInteractive and passing the element to the constructor.
 */
async function main() {
    let steps = window.steps = await fetchImages(); // Load all images before the game begins
    let elements = document.querySelectorAll("div.hangman"); // Find page elements to attach a game to

    window.interactives = []; // For debugging purposes

    for (let element of elements) {
        gameLoop(element, steps);
    }
}

/**
 * @param {HTMLElement} element
 */
async function gameLoop(element, steps) {
    while (true) {
        element.style.display = "none";
        let word = await fetchWordFromVercelApi();

        let images = steps[word.length <= 7 ? 7 : 11];

        let interactive = new HangmanInteractive(element, images, word, letter => VALID_CHARACTERS.includes(letter));
        
        let idx = window.interactives.length;
        window.interactives.push(interactive);

        element.style.removeProperty("display");
        let result = await interactive.promise;

        interactive._cleanup();
        delete window.interactives[idx];
    }
}

// Don't need to wait for load as this is handled by the defer tag on the script element in index.html
// window.addEventListener("load", activateGameInstances);

main();