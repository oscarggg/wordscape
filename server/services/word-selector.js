const { generateLetters } = require('./letter-generator');

// 1 version of algorithm that will be used to select words
async function selectWords() {
    try {
        let wordsToUse = 5;
        let letterLimit = 6;
        let topLetters = [];

        const letters = await generateLetters();
        const topWords = letters.slice(0, wordsToUse);
        const letterCount = {};

        topWords.forEach(word => {
            console.log('Word being processed:', word);
            for (const char of word) {
                if (letterCount[char]) {
                    letterCount[char]++;
                } else {
                    letterCount[char] = 1;
                }
            }
        });

        const sortedLetters = Object.entries(letterCount)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(entry => entry[0]);
        topLetters = sortedLetters.slice(0, letterLimit);
        console.log('Top 6 letters:', topLetters);
        return topLetters;
    } catch (error) {
        console.error('Error selecting words:', error);
        return [];
    }
}


// 2nd version of algorithm that will be used to choose the letters picked for the game
function selectRandomWords(stringArr) {
    
    if (!Array.isArray(stringArr)) {
        console.error('Invalid input: expected an array, received:', stringArr);
        return [];
    }

    try {
        let wordLimit = 30;
        const shuffled = stringArr.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, wordLimit);
        console.log('Selected random words:', selected);
        return selected;
    } catch (error) {
        console.error('Error selecting random words:', error);
        return [];
    }
}

module.exports = { 
    selectWords,
    selectRandomWords
 };

