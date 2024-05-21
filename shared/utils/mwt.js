class TrieNode {
    constructor(key) {
      this.key = key;
      this.children = {};
      this.isValidWord = false;
    }
  }
  
  class Trie {
      static ALPHABET_LEN = 26;
      static A = 65; // ascii value of A
      numWords = 0;
  
      constructor() {
          this.root = new TrieNode(null);
          for(let i = 0; i < Trie.ALPHABET_LEN; ++i) {
              let char = String.fromCharCode(Trie.A + i);
              this.root.children[i] = new TrieNode(char);
          }
      }
  
      insert(word) {
          let curr = this.root;
  
          if(!curr) { return false; }
          if(typeof word !== 'string') { return false; }
          if(word.length === 0) { return false; }
  
          let wordExists = this.search(word);
  
          if(wordExists) { return false; }
  
          for(let char of word) {
              if(!curr.children[char]) {
                  curr.children[char] = new TrieNode(char);
              }
              curr = curr.children[char];
          }
          curr.isValidWord = true;
          this.numWords++;
          return true;
      }
  
      search(word) {
          let curr = this.root;
  
          if(!curr) { return false; }
          if(typeof word !== 'string') { return false; }
          if(word.length === 0) { return false; }
  
          for(let char of word) {
              if(!curr.children[char]) {
                  return false;
              }
              curr = curr.children[char];
          }
          return curr.isValidWord;
      }
  
      delete(word) {
  
          if(typeof word !== 'string') { return false; }
          if(word.length === 0) { return false; }
  
          let curr = this.root;
          let wordExists = this.search(word);
  
          if(!wordExists) { return; }
  
          for(let char of word) {
              if(!curr.children[char]) {
                  return;
              }
              curr = curr.children[char];
          }
          curr.isValidWord = false;
          this.numWords--;
      }
  
      size() { return this.numWords; }
  
      serialize() {
        const serializeNode = (node) => {
            return {
                key: node.key,
                isValidWord: node.isValidWord,
                children: Object.fromEntries(Object.entries(node.children).map(([char, child]) => [char, serializeNode(child)]))
            };
        };
        return JSON.stringify({
            root: serializeNode(this.root),
            numWords: this.numWords
        });
    }
  
      static deserialize(serializedTrie) {
        const data = JSON.parse(serializedTrie);

        const deserializeNode = (node) => {
            const newNode = new TrieNode(node.key);
            newNode.isValidWord = node.isValidWord || false;
            newNode.children = Object.fromEntries(
                Object.entries(node.children).map(([char, child]) => [char, deserializeNode(child)]));
            return newNode;
        };
        const trie = new Trie();
        trie.root = deserializeNode(data.root);
        trie.numWords = data.numWords || 0;
        return trie;
    }
  }
  
export { Trie };
  
  
  