# WordleSolver
![solverDemo](./assets/solverDemo.webp)

This script uses the playwright library to automatically solve and play wordle game puzzles, with the help of a publicly available databank called Datamuse.

# Quick rundown
Essentially, all this script does is open a Chromium browser in playwright, and inputs guesses based on the correct or absent letters in the game. The first guess is always chosen as datamuses most common word of the day.
After the initial word, the next word is chosen based on the next most common word that includes - or doesn't include - the correct and absent letters respectively.

# More technical rundown
The letters are stored in three different Sets: correctLetters, presentLetters and absentLetters.
Everytime a guess needs to be done, before calling datamuseAPI, the script uses a custom made algorithm to choose the desired search keyword for the datamuse.
For example, if correct letters include 'A' and 'P' in tile slots 1 and 2 respectively, with no known correct letters in wrong tiles, the search keyword used for the API would be 'AP***', where the * are wildcards, meaning any letter is accepted. (Even A and P, in case of duplicate letters without prior information on absent letters.)

If there were known letters that are in the wrong tile, an additional parameter would be added to the keyword, which essentially tells that the searched word must *also* include the given letters somewhere in the word, that fit in with the predetermined search keyword, e.g aforementiond 'AP***'.

# How to run it
Simple explanation:
Install npm and playwright in root, then run 'node main.js' in root folder.

Detailed explanation:
1. Download the project files to your computer, either using Git (e.g., Git Bash) or by downloading the repository as a ZIP file.
2. Open the project folder in your preferred code editor or development environment, such as Visual Studio Code.
3. Install Node Package Manager (npm) if it is not already installed on your system.
4. Install Playwright inside the project’s root folder.
5. Open a terminal and run the command node main.js while you are in the project’s root folder.
    *Root folder = the main project folder you see after downloading the files. It is the folder that contains the README file and the project’s source files.
