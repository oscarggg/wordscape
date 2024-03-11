<template>
  <div class="game-board">
    <div class="letters-and-create">
      <div v-for="(letter, index) in letters" :key="index" class="letter-circle"
      :class="{ 'used': usedIndexes.includes(index)}" @click="addToCurrentWord(letter, index)">
      {{ letter }}
      </div>
      <button @click="createWord" class="menu-button">CREATE</button>
    </div>
    <button v-if="!gameStarted" @click="startGame" class="menu-button">PLAY</button>
  </div>
  </template>
  
  <script>
  
  export default {
    data () {
      return {
        letters: [], 
        usedIndexes: [], 
        currentWord: '',
        gameStarted: false,
        frequencies: {
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
        },
        bigrams: {
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
        },
        trigrams: {
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
        },
        quadrigrams: {
          that: 0.00761242,
          ther: 0.00604501,
          with: 0.00573866,
          tion: 0.00551919,
          here: 0.00374549,
          ould: 0.00369920,
          ight: 0.00309440,
          have: 0.00290544,
          hich: 0.00284292,
          whic: 0.00283826,
          thin: 0.00270413,
          they: 0.00262421,
          atio: 0.00262386,
          ever: 0.00260695,
          from: 0.00258580,
          ough: 0.00253447,
          were: 0.00231089,
          hing: 0.00229944,
          ment: 0.00223347
        }
      }
    },
    created () {
      this.letters = this.generateLetters()
    },
    mounted () {
      this.fetchRandomWords()
    },
    methods: {
      generateLettersOrPattern () {
        // Combine all patterns into a single array with their frequencies
        const patterns = [
          { type: 'quadrigram', values: Object.keys(this.quadrigrams), totalFrequency: 0.05 }, // Adjust totalFrequency as needed
          { type: 'trigram', values: Object.keys(this.trigrams), totalFrequency: 0.10 }, // Adjust totalFrequency as needed
          { type: 'bigram', values: Object.keys(this.bigrams), totalFrequency: 0.15 } // Adjust totalFrequency as needed
        ]
  
        // Calculate the total frequency of selecting any pattern
        const totalPatternFrequency = patterns.reduce((acc, pattern) => acc + pattern.totalFrequency, 0)
  
        // Decide whether to select a pattern or generate random letters
        if (Math.random() < totalPatternFrequency) {
          // Select a pattern based on its weighted frequency
          let cumulativeFrequency = 0
          const randomFrequency = Math.random() * totalPatternFrequency
          for (const pattern of patterns) {
            cumulativeFrequency += pattern.totalFrequency
            if (randomFrequency <= cumulativeFrequency) {
              const selectedPattern = this.selectRandomPattern(pattern.values)
              console.log(`Selected ${pattern.type}: ${selectedPattern}`)
              // Placeholder for calling the function to get possible words based on the selected pattern
              // const possibleWords = this.getPossibleWords(selectedPattern);
              // return possibleWords;
              break
            }
          }
        } else {
          // Proceed with the random letters if no pattern is selected
          return this.generateLetters()
        }
      },
      selectRandomPattern (patterns) {
        const randomIndex = Math.floor(Math.random() * patterns.length)
        return patterns[randomIndex]
      },
      generateLetters () {
        let letters = []
        const weightedLetters = this.createWeightedLetters()
  
        // Generate 5 random letters ensuring uniqueness
        while (letters.length < 5) {
          const randomIndex = Math.floor(Math.random() * weightedLetters.length)
          const letter = weightedLetters[randomIndex]
          if (!letters.includes(letter)) {
            letters.push(letter)
          }
        }
        letters = ['A','S','P','T','E','L']
        return letters
      },
      createWeightedLetters () {
        let weightedLetters = []
        for (const [letter, frequency] of Object.entries(this.frequencies)) {
          const weight = Math.floor(frequency * 10000) // Adjust the multiplier for a suitable weight
          for (let i = 0; i < weight; i++) {
            weightedLetters.push(letter)
          }
        }
        return weightedLetters
      },
      addToCurrentWord (letter, index) {
        if (!this.usedIndexes.includes(index)) {
          this.currentWord += letter
          this.usedIndexes.push(index) // Emit the letter to the parent
        }
      },
      validateWord (word) {
        return word.length > 0
      },
      async createWord () {
        const isValid = true
        if (isValid) {
          console.log('Valid word:', this.currentWord)
        } else {
          console.log('Invalid word:', this.currentWord)
        }
        this.currentWord = ''
        this.usedIndexes = []
      },
      startGame () {
        this.gameStarted = true
      },
      async fetchRandomWords () {
        try {
          // const response = await axios.get
          console.log('fetching words...')
        } catch (error) {
          console.error('Error fetching words:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .game-board {
  border-style: dashed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  }
  
  .letter-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    background-color: #FFC107;
    color: white;
    margin: 5px;
    font-size: 24px;
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
  }
  .letter-circle.used {
    /* Style for used letters, e.g., making them less visible */
    opacity: 0.5;
    pointer-events: none;
  }
  .letters-and-create {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content horizontally */
  }
  .menu-button {
    align-self: center;
    margin-top: auto;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  </style>
  