<template>
  <div class="game-board">
    <div v-for="(letter, letterIndex) in allLetters" :key="letterIndex" 
      class="letter-circle animate__animated animate__bounceInDown"
      :class="{ 'used': usedIndexes.includes(letterIndex)}" 
      @click="addToCurrentWord(letter, letterIndex)"
      :style="{ 
        left: positions[letterIndex] ? positions[letterIndex].x + 'px': '0px',
        width: constants.circleSize + 'px',
        height: constants.circleSize + 'px'
      }">
      {{ letter }}
    </div>
  </div>
  <div class="button-container">
      <Alphabet v-if="gameStarted" :usedIndexes="usedIndexes"/>
      <button v-if="!gameStarted" @click="startGame" class="menu-button">PLAY</button>
  </div>
</template>
  
  <script>
  import Alphabet from './Alphabet.vue'

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
        usedIndexes: [],
        positions: [],
        allLetters: [],
        constants: {
          circleSize: 45, // diameter of circles
          boardPadding: 20, // padding around the board
          fallSpeed: 5, // speed of the falling animation
          updateInterval: 20 // interval for updating position of letters
        }
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
        this.allLetters = this.words.join('').split('')
        console.log('preparing letters: ', this.allLetters);
        this.calculatePositions(this.allLetters)
      },
      calculatePositions(lettersArr) {

        if(!this.$el) {
          console.error('No element found');
          return;
        }
        // initialize positions array
        console.log('client width:', this.$el.nextElementSibling.clientWidth);
        console.log('circleSize:', this.constants.circleSize);
        let clientHeight = this.$el.nextElementSibling.clientHeight;
        this.positions = lettersArr?.map((_, index) => ({
          x: Math.random() * (clientHeight - this.constants.circleSize), // random x within the board
        }));
        /*this.positions = lettersArr?.map((_, index) => ({
          x: 3, // random x within the board
        }));*/
        console.log('Positions:', this.positions);
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
  border-style: dashed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70%;
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
    border-radius: 80%;
    position: absolute;
    user-select: none;
    cursor: pointer;
    bottom: 0;
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
  