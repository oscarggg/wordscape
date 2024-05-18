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

export {
    calculateFixedPositions,
    alternateRows
};

