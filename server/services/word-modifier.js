function capitalizeWords(wordArray) {
    return wordArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));
}

module.exports = {
    capitalizeWords
}

