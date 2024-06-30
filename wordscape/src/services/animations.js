import 'animate.css';

function calculateFixedPositions(letters, containerWidth, containerHeight, circleSize) {
    const positions = [];
    const circleGridSize = circleSize * 2; // Each circle spans 2 grid cells

    const lettersPerRow = Math.floor(containerWidth / circleGridSize);
    const altLetters = lettersPerRow - 1;

    letters.forEach((_, index) => {
        const rowNum = Math.floor(index / lettersPerRow);
        const colNum = index % lettersPerRow;
        const isOddRow = rowNum % 2 !== 0;
        const maxCircles = isOddRow ? altLetters : lettersPerRow;

        // Calculate positions starting from the bottom-right
        const x = isOddRow
            ? containerWidth - (colNum + 1.5) * circleGridSize
            : containerWidth - (colNum + 1) * circleGridSize;
        const y = containerHeight - (rowNum + 1) * circleGridSize;

        positions.push({ x, y });
    });

    return positions;
}

function alternateRows(lettersArr, contWidth, circleSize, maxLetters) {
    const rows = [];
    const circleGridSize = circleSize; // Circle size with margin
    const lettersPerRow = Math.min(maxLetters, Math.floor(contWidth / circleGridSize));
    const alternatingLettersPerRow = lettersPerRow - 1;

    let row = [];
    lettersArr.forEach((letter, index) => {
        const rowNum = Math.floor(index / lettersPerRow);
        const isOddRow = rowNum % 2 !== 0;
        const maxCircles = isOddRow ? alternatingLettersPerRow : lettersPerRow;

        row.push(letter);
        if (row.length === maxCircles) {
            rows.push(row);
            row = [];
        }
    });

    if (row.length > 0) {
        rows.push(row);
    }

    return rows;
}

function createRows(lettersArr, contWidth, circleSize, lettersPerRow) {
    const rows = [];
    let row = [];

    lettersArr.forEach((letter, index) => {
        row.push(letter);
        if(row.length === lettersPerRow) {
            rows.push(row);
            row = [];
        }
    });

    if (row.length > 0) {
        rows.push(row);
    }

    return rows;
}

function updateIndexes(rows) {
    const numCols = Math.max(...rows.map(row => row.length));
    
    for(let col = 0; col < numCols; ++col) {
        let emptySpots = 0;

        for(let row = rows.length - 1; row >= 0; --row) {
            if(rows[row][col] === undefined || rows[row][col] === null) {
                emptySpots++;
            } else if(emptySpots > 0) {
                rows[row + emptySpots][col] = rows[row][col];
                rows[row][col] = null;
            }
        }
    }

    return rows.filter(row => row.some(letter => letter !== null));
}

function applyAnimation(animationName, hoveredIndexes, getRowAndLetterIndexes) {
    hoveredIndexes.forEach(index => {
        const { rowIndex, letterIndex } = getRowAndLetterIndexes(index);
        const element = document.querySelector(`.row:nth-child(${rowIndex + 1}) .letter-circle:nth-child(${letterIndex + 1})`);
        if(element) {
            //element.parentElement.classList.add('animate__animated', animationName);
            //element.classList.remove('animate__animated', animationName);
            //element.classList.add('animate__animated', 'bounce');
            //void element.offsetWidth;
            //element.classList.remove('animate__animated', animationName);
            //element.classList.add('animate__animated', animationName);
            console.log('element', element);
            console.log('element class list', element.classList);

            // remove animation classes to allow for reapplication later
            element.addEventListener('animationend', function removeAnimation() {
                element.classList.remove('animate__animated', animationName);
                element.removeEventListener('animationend', removeAnimation);
            });
        }
        
    });
}

export {
    calculateFixedPositions,
    alternateRows,
    createRows,
    updateIndexes,
    applyAnimation
};

