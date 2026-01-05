import { absentLetters, presentLetters, pastGuesses } from "./main.js";

export async function fetchWords(apiPrompt) {
    const api = `https://api.datamuse.com/words?sp=${apiPrompt}&md=f&max=1000`;
    try {
        const response = await fetch(api);
        const data = await response.json();
        const words = data.map(item => item.word);
        const result = filterWords(words, absentLetters, presentLetters);
        return result[0];
    } catch (error) {
        console.error('Something went wrong while fetching words:', error);
        return null;
    }
}

function filterWords(words, absentLetters, presentLetters) {
    const filteredWords = words.filter(word => [...absentLetters].every(letter => !word.includes(letter)));

    const finalWords = filteredWords.filter(word => presentLetters.every(({letter, tilePos}) => {
        return word.includes(letter) && word[tilePos] !== letter;
    }));
    const lastPass = finalWords.filter(word => !pastGuesses.has(word));

    console.log('Filtered words:', lastPass);
    return lastPass;
}
