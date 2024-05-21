<template>
  <div class="game-board">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="row">
      <div v-for="(letter, letterIndex) in row" :key="letterIndex" 
        class="letter-circle animate__animated animate__bounceInDown"
        :class="{ 'used': usedIndexes.includes(getGlobalIndex(rowIndex, letterIndex)), 'hovered': hoveredIndexes.includes(getGlobalIndex(rowIndex, letterIndex))}" 
        @mouseover="hoverLetter($event, getGlobalIndex(rowIndex, letterIndex))"
        @mousedown="startSelection($event, getGlobalIndex(rowIndex, letterIndex))"
        @mouseup="endSelection()">
        {{ letter }}
      </div>
    </div>
  </div>
  <div class="button-container">
      <Alphabet v-if="gameStarted" :usedIndexes="usedIndexes"/>
      <button v-if="!gameStarted" @click="startGame" class="menu-button">PLAY</button>
  </div>
</template>
  
  <script>
  import Alphabet from './Alphabet.vue'
  import { calculateFixedPositions, alternateRows } from '../services/animations.js'
  import { wordSplitter } from '../services/word-generator.js'
  import { formWord } from '../services/game-mechanics.js'

  export default {
    components: {
      Alphabet
    },
    props: {
      words: Array,
    },
    data () {
      return {
        gameStarted: false,
        isSelecting: false,
        usedIndexes: [],
        hoveredIndexes: [],
        positions: [],
        allLetters: [],
        rows: [],
        constants: {
          circleSize: 45, // diameter of circles
          boardPadding: 20, // padding around the board
          fallSpeed: 5, // speed of the falling animation
          updateInterval: 20 // interval for updating position of letters
        },
      }
    },
    watch: {
      words: {
        immediate: true,
        handler(newVal) {
          if(newVal && newVal.length > 0) {
            this.$nextTick(() => {
              this.prepareLetters();
            });
          }
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
        this.allLetters = wordSplitter(this.words).join('').split('');
        //this.allLetters = generateRandomLetters(120);
        console.log('preparing letters: ', this.allLetters);
        const containerHeight = this.$el.nextElementSibling.clientHeight;
        const containerWidth = this.$el.nextElementSibling.clientWidth;
        this.rows = alternateRows(this.allLetters, containerWidth, this.constants.circleSize, 10);
        this.positions = calculateFixedPositions(this.allLetters, containerWidth, containerHeight, this.constants.circleSize);
        console.log('Positions:', this.positions);
      },
      startSelection(event, index) {
        this.isSelecting = true;
        if(!this.hoveredIndexes.includes(index)) {
          console.log('Starting selection, index is: ', index);
          console.log('Event', event);
          this.hoveredIndexes.push(index);
          this.$forceUpdate();
        }
      },
      endSelection() {
        this.isSelecting = false;
        const formedWord = formWord(this.allLetters, this.hoveredIndexes);
        console.log('Formed word:', formedWord);
        this.hoveredIndexes = [];
      },
      hoverLetter(event, index) {
        if(this.isSelecting) {
          console.log('hovering over index', index);
          const hoverIndex = this.hoveredIndexes.indexOf(index);
          if(hoverIndex === -1) {
            this.hoveredIndexes.push(index);
          } else if(hoverIndex != this.hoveredIndexes.length - 1) {
            this.hoveredIndexes = this.hoveredIndexes.slice(0, hoverIndex + 1);
          }
          this.$forceUpdate();
        }
      },
      getGlobalIndex(rowIndex, letterIndex) {
        let globalIndex = 0;
        for(let i = 0; i < rowIndex; i++) {
          globalIndex += this.rows[i].length;
        }
        return globalIndex + letterIndex;
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

  .letter-circle.hovered {
    background-color: #121bc7;
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
  