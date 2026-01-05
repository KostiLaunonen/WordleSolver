import { fetchWords } from './datamuseAPI.js';
import { chromium } from 'playwright'

export const absentLetters = new Set();
export const presentLetters = [];
export const correctLetters = new Set();
export const pastGuesses = new Set();
let tilePos = 0;
let apiPrompt = '?????';

async function getNextGuess(apiPrompt) {
  const guess = await fetchWords(apiPrompt) || 'error';
  console.log('Next guess:', guess);
  return guess;
}

async function getKey(page, char) {
  return await page.$(`[data-key="${char}"]`);
}

async function typeWord(page, word) {
  for (const char of word.toLowerCase()) {
    const key = await getKey(page, char);
    if (key) await key.click();
  }

  const enterKey = await getKey(page, '↵');
  if (enterKey) await enterKey.click();
}

function updateApiPrompt(apiPrompt, letter, position) {
  const promptArray = apiPrompt.split("");
  promptArray[position] = letter;
  return promptArray.join("");
}

function getTilePos(tile) {
  const index = tile;
  const position = index % 5;

  return position;
}

async function runSolver() {
  ////// INITIALIZATION BLOCK //////
  console.log('Running solver!');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://wordleunlimited.org');
  await page.getByRole('button', { name: 'Consent' }).click();
  await page.mouse.click(10, 10);

  // Disables scrolling while inputting words
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.onscroll = () => window.scrollTo(0, 0);
  });


  ////// INITIALIZATION BLOCK //////

  for (let i = 0; i < 6; i++) {

    console.log(`Absent letters: ${[...absentLetters]}`)
    console.log(`Correct letters: ${[...correctLetters]}`)
    console.log(`Present letters: ${[...presentLetters]}`)

    const guess = await getNextGuess(apiPrompt);

    // Input word
    await typeWord(page, guess);
    await page.waitForTimeout(2000);

    const tiles = page.locator('game-row game-tile');
    const count = await tiles.count()

    for (let i = 0; i < count; i++) {
      const tile = tiles.nth(i);
      const letter = await tile.getAttribute('letter');
      const state = await tile.getAttribute('evaluation')
      // console.log(`Tile ${i}: ${letter} Status: ${state}`);
      switch (state) {
        case 'absent':
          if (!presentLetters.includes(letter) && !correctLetters.has(letter)) {
            absentLetters.add(letter)
            break;
          }

        case 'present':
          tilePos = getTilePos(i);
          presentLetters.push({ letter, tilePos })
          break;

        case 'correct':
          // TODO: Lock the letter in place in future guesses
          correctLetters.add(letter)
          tilePos = getTilePos(i);
          apiPrompt = updateApiPrompt(apiPrompt, letter, tilePos)
          break;
      }
      pastGuesses.add(guess);

    }
  }
  console.log("All done!");
}

runSolver();