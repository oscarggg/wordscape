function calculateFixedPositions(lettersArr, containerWidth, circleSize) {
    const positions = [];
    const totalLetters = lettersArr.length;
    const spaceAvailable = containerWidth - (circleSize * totalLetters);
    const spacing = spaceAvailable / (totalLetters - 1);

    lettersArr.forEach((letter, index) => {
        positions[index] = {
            x: index * spacing,
            y: 0
        }
        positions.push()
    });

    return positions;
}

