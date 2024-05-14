<template>
  <div class="alphabet-container">
    <span v-for="letter in alphabet" :key="letter">
        {{ letter }}
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      alphabet: Array,
    },
    data () {
        return {
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        };
    }
  }
</script>

<style scoped>
.alphabet-container span {
    display: inline-block;
    margin: 2px;
    padding: 5px;
    background-color: #f0f0f0;
    color: #333;
    font-size: 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>

