<template>
  <div class="game-board" :class="{ 'opaque': !gameStarted }" @mouseup="handleMouseUp">
    <template v-if="gameStarted">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="row">
        <div v-for="(letter, letterIndex) in row" :key="letterIndex" 
          class="letter-circle"
          :class="getLetterClasses(rowIndex, letterIndex)"
          :style="getLetterStyles(rowIndex, letterIndex)"
          @mouseover="hoverLetter($event, getGlobalIndex(rowIndex, letterIndex))"
          @mousedown="startSelection($event, getGlobalIndex(rowIndex, letterIndex))"
          @mouseup.stop="endSelection($event, getGlobalIndex(rowIndex, letterIndex))">
          {{ letter }}
        </div>
      </div>
    </template>
  </div>
  <div class="button-container">
      <button v-if="!gameStarted" @click="startGame" class="menu-button">PLAY</button>
  </div>
</template>
  
  <script>
  import Alphabet from './Alphabet.vue'
  import { calculateFixedPositions, updateIndexes, createRows, applyAnimation } from '../services/animations.js'
  import { wordSplitter } from '../services/word-generator.js'
  import { formWord, replaceLetters, replaceLettersUnweighted } from '../services/game-mechanics.js'
  import { Trie } from '../../../shared/utils/mwt.js'

  export default {
    components: {
      Alphabet
    },
    props: {
      words: Array,
      trie: {
        type: Object,
        required: true
      },
      gameStarted: Boolean
    },
    data () {
      return {
        isSelecting: false,
        isProcessing: false,
        isAnimating: false,
        selectionComplete: false,
        usedIndexes: [],
        hoveredIndexes: [],
        hoveredElements: [],
        validIndexes: [],
        positions: [],
        allLetters: [],
        isInitialLoad: true,
        rows: [],
        constants: {
          circleSize: 45, // diameter of circles
          boardPadding: 20, // padding around the board
          fallSpeed: 5, // speed of the falling animation
          updateInterval: 20, // interval for updating position of letters
          frequencies:  {
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
          }
        },
      }
    },
    mounted() {
      document.addEventListener('mouseup', this.handleGlobalMouseUp);
    },
    beforeUnmount() {
      document.removeEventListener('mouseup', this.handleGlobalMouseUp);
    },
    watch: {
      gameStarted(newVal) {
        if(newVal) {
          this.prepareLetters();
        }
      }
    },
    methods: {
      startGame () {
        this.gameStarted = true
      },
      addToCurrentWord (letter, index) {
        if (!this.usedIndexes.includes(index)) {
          this.currentWord += letter
          this.usedIndexes.push(index) // Emit the letter to the parent
        }
      },
      prepareLetters() {
        this.isAnimating = true;
        this.allLetters = wordSplitter(this.words).join('').split('');
        //this.allLetters = generateRandomLetters(120);
        console.log('preparing letters: ', this.allLetters);
        const containerHeight = this.$el.nextElementSibling.clientHeight;
        const containerWidth = this.$el.nextElementSibling.clientWidth;
        let lettersPerRow = 10;
        //this.rows = alternateRows(this.allLetters, containerWidth, this.constants.circleSize, lettersPerRow);
        this.rows = createRows(this.allLetters, containerWidth, this.constants.circleSize, lettersPerRow);
        this.positions = calculateFixedPositions(this.allLetters, containerWidth, containerHeight, this.constants.circleSize);
        console.log('Positions:', this.positions);
        //this.isInitialLoad = true; // Ensure initial load state is true
        setTimeout(() => {
          this.isAnimating = false; // Reset the initial load state after animation
        }, this.rows.length * this.rows[0].length * 50 + 1000); // Adjust to match the animation duration
      },
      startSelection(event, index) {
        if(this.isProcessing) return;

        this.isSelecting = true;
        /*if(!this.hoveredIndexes.includes(index)) {
          console.log('Starting selection, index is: ', index);
          console.log('Event', event);
          this.hoveredIndexes.push(index);
          
          this.$forceUpdate();
        }*/
        this.selectionComplete = false;
        this.hoveredIndexes = [index];
        this.$forceUpdate;
      },
      endSelection(event, index) {
        /*if(this.isProcessing) return;

        this.isSelecting = false;
        const formedWord = formWord(this.allLetters, this.hoveredIndexes);
        const wordExists = this.trie.search(formedWord);

        console.log('Formed word:', formedWord);
        console.log('Word exists:', wordExists);
        console.log('hovered indexes', this.hoveredIndexes);

        if(wordExists) {
          this.isProcessing = true;
          console.log('hovered elements', this.hoveredElements);
          this.removeSelectedCircles();
          this.validIndexes = this.hoveredIndexes;
          
          setTimeout(() => {
            this.validIndexes = [];
            this.fillEmptyCircles();
            this.$forceUpdate;
            this.isProcessing = false;
          }, 1000);
        }
        this.hoveredIndexes = [];*/
        event.stopPropagation();
        this.isSelecting = false;
        this.selectionComplete = true;
        this.processWord();
      },
      handleMouseUp() {
        if(this.isProcessing) return;
        this.selectionComplete = true;
        this.isSelecting = false;
        this.processWord();
      },
      handleGlobalMouseUp() {
        if(this.isSelecting) {
          this.isSelecting = false;
          this.processWord();
        }
      },
      processWord() {
        if(this.isProcessing || this.hoveredIndexes.length === 0) return;

        const formedWord = formWord(this.allLetters, this.hoveredIndexes);
        const wordExists = this.trie.search(formedWord);
        console.log('Formed word:', formedWord);
        console.log('Word exists:', wordExists);
        console.log('hovered indexes', this.hoveredIndexes);
        
        if(wordExists) {
          this.isProcessing = true;
          console.log('hovered elements', this.hoveredElements);
          this.removeSelectedCircles();
          this.validIndexes = this.hoveredIndexes;
          
          setTimeout(() => {
            this.validIndexes = [];
            this.fillEmptyCircles();
            this.$forceUpdate;
            this.isProcessing = false;
          }, 1000);
        }
        this.hoveredIndexes = [];
        this.selectionComplete = false;
      },
      hoverLetter(event, index) {
        if(this.isProcessing || this.selectionComplete) return;

        if(this.isSelecting) {
          console.log('hovering over index', index);
          const lastIndex = this.hoveredIndexes[this.hoveredIndexes.length - 1];

          // if this is the first letter or if it's adjacent to the last letter
          if(this.hoveredIndexes.length === 0 || this.areIndexesAdjacent(lastIndex, index)) {
            if(!this.hoveredIndexes.includes(index)) {
              this.hoveredIndexes.push(index);
            } else if(index === this.hoveredIndexes[this.hoveredIndexes.length - 2]) {
              // if user goes back to previous letter
              this.hoveredIndexes.pop();
            }
            this.$forceUpdate();
          }
        }
      },
      getGlobalIndex(rowIndex, letterIndex) {
        let globalIndex = 0;
        for(let i = 0; i < rowIndex; i++) {
          globalIndex += this.rows[i].length;
        }
        return globalIndex + letterIndex;
      },
      removeSelectedCircles() {
        const circlesToRemove = new Set(this.hoveredIndexes);
        console.log('circlesToRemove', circlesToRemove);
        this.rows = this.rows.map((row, rowIndex) =>
          row.map((letter, letterIndex) => circlesToRemove.has(this.getGlobalIndex(rowIndex, letterIndex)) ? '' : letter)
        );
      },
      fillEmptyCircles() {
        this.rows = replaceLettersUnweighted(this.rows);
        this.allLetters = this.rows.flat();
      },
      getRowAndLetterIndexes(globalIndex) {
        let currIndex = 0;
        const rowLengths = this.getRowLengths();

        for(let rowIndex = 0; rowIndex < rowLengths.length; rowIndex++) {
          /*for(let letterIndex = 0; letterIndex < this.rows[rowIndex].length; letterIndex++) {
            if(currIndex === globalIndex) {
              return { rowIndex, letterIndex };
            }
            currIndex++;
          }*/
          if(currIndex + rowLengths[rowIndex] > globalIndex) {
            return { rowIndex, letterIndex: globalIndex - currIndex };
          }
          currIndex += rowLengths[rowIndex];
        }
        return null;
      },
      rearrangeCircles() {
        this.rows = updateIndexes(this.rows);
        this.allLetters = this.rows.flat(); // rebuild allLetters from the rows
      },
      updateLetterPositions() {
        this.$nextTick(() => {
          const constHeight = this.$el.nextElementSibling.clientHeight;
          const constWidth = this.$el.nextElementSibling.clientWidth;
          this.positions = calculateFixedPositions(this.allLetters, constWidth, constHeight, this.constants.circleSize);
        });
      },
      areIndexesAdjacent(index1, index2) {
        // check if there is a top row special case
        if(this.areTopIndexesAdjacent(index1, index2)) return true;

        const { rowIndex: row1, letterIndex: col1 } = this.getRowAndLetterIndexes(index1);
        const { rowIndex: row2, letterIndex: col2 } = this.getRowAndLetterIndexes(index2);

        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);

        // indexes are adjacent if they are next to each other horizontally, vertically, or diagonally
        return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
      },
      getLetterClasses(rowIndex, letterIndex) {
        const index = this.getGlobalIndex(rowIndex, letterIndex);
        return {
          'animate__animated': true,
          'animate__bounceInDown': this.isAnimating,
          'animate__rubberBand': this.validIndexes.includes(index),
          'used': this.usedIndexes.includes(index),
          'hovered': this.hoveredIndexes.includes(index),
          'valid-word': this.validIndexes.includes(index),
          'disabled': this.isProcessing
        }
      },
      getLetterStyles(rowIndex, letterIndex) {
        const index = this.getGlobalIndex(rowIndex, letterIndex);
        return {
          animationDelay: this.isAnimating ? `${index * 50}ms` : '0ms'
        }
      },
      getRowLengths() {
        return this.rows.map(row => row.length);
      },
      areTopIndexesAdjacent(index1, index2) {
        const rowLengths = this.getRowLengths();
        const totalLetters = rowLengths.reduce((sum, length) => sum + length, 0);
        const topRowStart = totalLetters - rowLengths[rowLengths.length - 1];
        const secondRowStart = topRowStart - rowLengths[rowLengths.length - 2];

        // If both indexes are not in the top two rows, return false
        if (index1 < secondRowStart && index2 < secondRowStart) return false;

        // If one index is in the top row and one is in the second row
        if ((index1 >= topRowStart && index2 < topRowStart) || (index2 >= topRowStart && index1 < topRowStart)) {
          const topIndex = Math.max(index1, index2);
          const bottomIndex = Math.min(index1, index2);
          const topColIndex = topIndex - topRowStart;
          const bottomColIndex = bottomIndex - secondRowStart;

          // Check if they're within one column of each other
          return Math.abs(topColIndex - bottomColIndex) <= 1;
        }

        // If both are in the top row
        if (index1 >= topRowStart && index2 >= topRowStart) {
          return Math.abs(index1 - index2) === 1;
        }

        // If both are in the second row
        if (index1 >= secondRowStart && index2 >= secondRowStart && index1 < topRowStart && index2 < topRowStart) {
          return Math.abs(index1 - index2) <= 1;
        }

        return false;
      }
    }
  }
  </script>
  
  <style scoped>
  .button-container {
    border: 1px solid #2612b7;
    position: absolute;
    bottom: 0;
    height: 200px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .game-board {
    background-color: #325640;
    border-style: dashed;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: 73%;
    position: relative;
    width: 100%;
    padding: var(--board-padding);
    overflow: hidden; /* prevent letters from going outside the board */
  }

  .game-board.opaque {
    opacity: 0.5;
  }
  
  .letter-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFC107;
    color: white;
    font-size: 24px;
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
    width: 45px;
    height: 45px;
  }

  .letter-circle.animate__animated {
    opacity: 1;
  }
  
  .letter-circle.valid-word {
    animation: rubberBand;
    animation-duration: 1s;
    background-color: #4CAF50;
  }

  .letter-circle.hovered {
    background-color: #121bc7;
  }

  .letter-circle.disabled {
    pointer-events: none;
  }

  .row {
    display: flex;
    justify-content: center;
    width: 100%;
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
  