const { fetchRandomWords } = require('./randomWords');
const { fetchWordsWithSequence } = require('./word-fetcher');

const generateLetters = async () => {
  let lo = 4;
  let hi = 8;
  let limit = 100;
  let singleLetter = false;
  const letters = {
    a: 0.08167,
    b: 0.01492,
    c: 0.02782,
    d: 0.04253,
    e: 0.12702,
    f: 0.02228,
    g: 0.02015,
    h: 0.06094,
    i: 0.06966,
    j: 0.00153,
    k: 0.00772,
    l: 0.04025,
    m: 0.02406,
    n: 0.06749,
    o: 0.07507,
    p: 0.01929,
    q: 0.00095,
    r: 0.05987,
    s: 0.06327,
    t: 0.09056,
    u: 0.02758,
    v: 0.00978,
    w: 0.02360,
    x: 0.00150,
    y: 0.01974,
    z: 0.00074
  };
  const bigrams = {
    th: 0.03882543,
    he: 0.03681391,
    in: 0.02283899,
    er: 0.02178042,
    an: 0.02140460,
    re: 0.01749394,
    nd: 0.01571977,
    on: 0.01418244,
    en: 0.01383239,
    at: 0.01335523,
    ou: 0.01285484,
    ed: 0.01275779,
    ha: 0.01274742,
    to: 0.01169655,
    or: 0.01151094,
    it: 0.01134891,
    is: 0.01109877,
    hi: 0.01092302,
    es: 0.01092301,
    ng: 0.01053385
  };
  const trigrams = {
    the: 0.03508232,
    and: 0.01593878,
    ing: 0.01147042,
    her: 0.00822444,
    hat: 0.00650715,
    his: 0.00596748,
    tha: 0.00593593,
    ere: 0.00560594,
    for: 0.00555372,
    ent: 0.00530771,
    ion: 0.00506454,
    ter: 0.00461099,
    was: 0.00460487,
    you: 0.00437213,
    ith: 0.00431250,
    ver: 0.00430732,
    all: 0.00422758,
    wit: 0.00397290,
    thi: 0.00394796,
    tio: 0.00378058
  };
  const quadgrams = {
    tion: 0.00551919,
    here: 0.00374549,
    ould: 0.00369920,
    ight: 0.00309440,
    have: 0.00290544,
    hich: 0.00284292,
    whic: 0.00283826,
    atio: 0.00262386,
    ever: 0.00260695,
    ough: 0.00253447,
    ment: 0.00223347
  };

  function determineSequence() {
    const totalFreqs = {
        bigram: Object.values(bigrams).reduce((acc, val) => acc + val, 0),
        trigram: Object.values(trigrams).reduce((acc, val) => acc + val, 0),
        quadgram: Object.values(quadgrams).reduce((acc, val) => acc + val, 0)
    };

    const total = totalFreqs.bigram + totalFreqs.trigram + totalFreqs.quadgram;
    const noneFreq = 1 - total;
    const random = Math.random();

    let cumulative = 0;

    // determine if bigram will be used
    cumulative += totalFreqs.bigram;
    if (random < cumulative) {
        return selectRandomSequence(bigrams);
    }

    // determine if a trigram will be used
    cumulative += totalFreqs.trigram;
    if (random < cumulative) {
        return selectRandomSequence(trigrams);
    }

    // determine if a quadrigram will be used
    cumulative += totalFreqs.quadgram;
    if (random < cumulative) {
        return selectRandomSequence(quadgrams);
    }

    // if no sequence is selected, use random letters
    singleLetter = true;
    return selectRandomLetters(letters, hi);
  }

  function selectRandomSequence(sequences) {
    const keys = Object.keys(sequences);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const key = keys[randomIndex];
    return {
        sequence: key,
        frequency: sequences[key]
    };
  }

  function selectRandomLetters(letters, count) {
    let selected = '';
    let entries = Object.entries(letters);
    for (let i = 0; i < count; ++i) {
        let totalWeight = entries.reduce((acc, [letter, weight]) => acc + weight, 0);
        let randomWeight = Math.random() * totalWeight;
        for(let [letter, weight] of entries) {
            if(randomWeight < weight) {
                selected += letter;
                entries = entries.filter(entry => entry[0] !== letter);
                break;
            }
            randomWeight -= weight;
        }
    }
    return { sequence: selected, frequency: 1 };
  }

  function sortStringsByLength(wordsArr) {
    return wordsArr.sort((a, b) => b.length - a.length);
  }

  const sequence = determineSequence();
  const pattern = sequence.sequence;
  
  if(singleLetter) {
    const list = await fetchRandomWords(pattern);
    const sortedList = sortStringsByLength(list);
    console.log('Fetched singular list:', sortedList);
  } else {
    const words = await fetchWordsWithSequence(pattern, lo, hi, limit);
    const sortedList = sortStringsByLength(words);
    console.log('Fetched non-singular lists:', sortedList);
  }
};

module.exports = { generateLetters };

