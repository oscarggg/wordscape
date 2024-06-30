const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const vowels = 'AEIOU';

function formWord(letters, indexes) {
    return indexes.map(index => letters[index]).join('');
}

function generateWeightedList(frequencies) {
    const weightedList = [];
    let multiplier = 10000;
    for (const [letter, frequency] of Object.entries(frequencies)) {
        const count = Math.round(frequency * multiplier);
        for (let i = 0; i < count; i++) {
            weightedList.push(letter);
        }
    }
    return weightedList;
}

function replaceLetters(rows, frequencies) {
    const weightedList = generateWeightedList(frequencies);
    const getRandomLetter = () => weightedList[Math.floor(Math.random() * weightedList.length)];
    
    for(let row = rows.length - 1; row >= 0; row--) {
        for(let col = 0; col < rows[row].length; col++) {
            if(rows[row][col] === '') {
                rows[row][col] = getRandomLetter().toUpperCase();
            }
        }
    }
    return rows;
}

function getRandomLetter(excludeSet) {
    let letter;
    do{
        letter = alpha[Math.floor(Math.random() * alpha.length)];
    } while (excludeSet.has(letter));
    excludeSet.add(letter);
    return letter;
}

function getRandomVowel(excludeSet) {
    let vowel;
    do {
        vowel = vowels[Math.floor(Math.random() * vowels.length)];
    } while (excludeSet.has(vowel));
    excludeSet.add(vowel);
    return vowel;
}   

function replaceLettersUnweighted(rows) {
    const newRows = rows.map(row => {
        const excludeSet = new Set();
        const newRow = row.map(letter => {
            if(letter === '') {
                return getRandomLetter(excludeSet);
            }
            return letter;
        });

        // ensure there is at least one vowel in the row
        const containsVowel = newRow.some(letter => vowels.includes(letter));
        if(!containsVowel) {
            const randomIndex = Math.floor(Math.random() * newRow.length);
            newRow[randomIndex] = getRandomVowel(excludeSet);
        }
        return newRow;
    });
    return newRows;
}

export {
    formWord,
    generateWeightedList,
    replaceLetters,
    replaceLettersUnweighted
}

