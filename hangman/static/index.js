"use strict";

import HITGallowsInteractive from "./HangmanInteractive.js";
import GallowsGame from "./Hangman.js";

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

// async function getWord()
// {
//     let randomWordArray = [];
//     let objRandomWord = {};

//     let randomWord = "";
//     [randomWord] = await getRandomWord();

//     if ( randomWord.word.length > 0 )
//     {
//         for ( let i=0; i < randomWord.word.length; i++ )
//         {
//             let tmpObj = {
//                 char: randomWord.word[i],
//                 show: false
//             };
//             randomWordArray.push(tmpObj);
//         }

//         let maxRetries = randomWord.word.length < 7 ? 7 : 11;

//         objRandomWord = {
//             word: randomWord.word,
//             maxCharacters: randomWord.word.length,
//             characters: randomWordArray,
//             maxRetries: maxRetries,
//             numRetries: 0
//         }

//     }
//     return objRandomWord;
// }

/**
 * This will turn all div elements with class "hangman" into game instances.
 * To add instances later, do so manually by creating a HITGallowsInteractive and passing the element to the constructor.
 */
async function main() {
    let steps = window.steps = await fetchImages();

    let elements = document.querySelectorAll("div.hangman"); // Find page elements to attach a game to

    let interactives = window.interactives = [];
    for (let element of elements) {
        fetchWordFromVercelApi()
            .then(word => {
                console.log(word);
                
                let imageSeries = steps[7];
                let generator = () => new GallowsGame(word, imageSeries.length - 1);
                let interactive = new HITGallowsInteractive(element, generator, imageSeries);
                return interactive;
            })
            .then(interactive => {
                console.log(interactive);
                interactives.push(interactive);
            });
    }
}

// Don't need to wait for load as this is handled by the defer tag on the script element in index.html
// window.addEventListener("load", activateGameInstances);

main();