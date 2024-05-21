function generateRandomLetters(limit = 100) {
    const freqs = {
        A: 8.17,
        B: 1.49,
        C: 2.78,
        D: 4.25,
        E: 12.70,
        F: 2.23,
        G: 2.02,
        H: 6.09,
        I: 6.97,
        J: 0.15,
        K: 0.77,
        L: 4.03,
        M: 2.41,
        N: 6.75,
        O: 7.51,
        P: 1.93,
        Q: 0.10,
        R: 5.99,
        S: 6.33,
        T: 9.06,
        U: 2.76,
        V: 0.98,
        W: 2.36,
        X: 0.15,
        Y: 1.97,
        Z: 0.07
    };

    // create an array with each letter repeated based on its frequency
    const letters = [];
    const scaleFactor = 10;
    for(const [letter, frequency] of Object.entries(freqs)) {
        const count = Math.round(frequency * scaleFactor);
        for(let i = 0; i < count; ++i) {
            letters.push(letter);
        }
    }

    const randomLetters = [];
    for(let i = 0; i < limit; ++i) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        randomLetters.push(letters[randomIndex]);
    }
    return randomLetters;
}

// scrambles all words one by one in the string array randomly
function scrambleWords(words) {

    function scramble(word) {
        let scrambledLetters = word.split('');
        for(let i = scrambledLetters.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [scrambledLetters[i], scrambledLetters[j]] = [scrambledLetters[j], scrambledLetters[i]];
        }
        return scrambledLetters.join('');
    }
    return words.map(word => scramble(word));
}

// cuts off every word starting from the end up to the first vowel (exlusive).
function wordSplitter(words) {
    function splitWord(word) {
        const ratio = 0.8;
        const splitIndex = Math.ceil(word.length * ratio);
        return [word.slice(0, splitIndex), word.slice(splitIndex)];
    }

    const result = [];
    for (const word of words) {
        const [firstPart, secondPart] = splitWord(word);
        result.push(firstPart, secondPart);
    }

    return shuffleArray(result);
}

function shuffleArray(words) {
    for(let i = words.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
}

export { 
    generateRandomLetters,
    scrambleWords,
    wordSplitter
};

