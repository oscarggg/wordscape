<template>
  <div class="home-container">
    <GameBoard :words="words"/>
  </div>
</template>

<script>
import GameBoard from './GameBoard.vue'
import api from '@/services/api'

export default {
  name: 'home',
  components: {
    GameBoard
  },
  data () {
    return {
      gameStarted: false,
      words: []
    }
  },
  created() {
    this.getWords();
  },
  methods: {
    getWords() {
      api.getWords().then(response => {
        this.words = response.data;
        console.log(response.data);
      });
    },
    startGame () {
      this.gameStarted = true
    }
  }
}
</script>

<style scoped>
.home-container {
  border: 2px double rgb(9, 246, 61);
  border-style: double;
  margin: 0 auto 10%;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures content is spaced out vertically */
  align-items: center;
  height: 100vh; /* Full height of the viewport */
  padding: 20px; /* Padding around the container */
  position: relative;
}

.menu {
  padding: 30px;
  border: 2px solid black;
  width: 90%; /* Full width to center the button */
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Aligns the button to the bottom */
  height: 100%; /* Takes full height of its container */
}

button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #FFD700; /* Fun button color */
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px; /* Margin at the bottom for spacing */
}
</style>