import { describe, it, expect, beforeEach } from 'vitest'
import Trie from '../utils/multiway-trie'

describe('Trie', () => {
  let trie;
  let word1 = 'hello';
  let word2 = 'world';

  beforeEach(() => {
    trie = new Trie();
  });

  describe('insert', () => {
    it('should mark a word as valid after inserting it', () => {
      let size = trie.size();
      expect(size).toBe(0);
      trie.insert(word1);
      expect(trie.size()).toBe(1);
      let node = trie.root;
      for(let char of word1) {
        node = node.children[char];
        expect(node).toBeDefined();
      }
      expect(node.isValidWord).toBe(true);
      trie.insert(word2);
      expect(trie.size()).toBe(2);
      expect(trie.search(word1)).toBe(true);
      expect(trie.search(word2)).toBe(true);
    });

    it('should not insert a word that already exists', () => {
      trie.insert(word1);
      expect(trie.size()).toBe(1);
      trie.insert(word1);
      expect(trie.size()).toBe(1);
    });

    it('should not insert a word that is not a string', () => {
      expect(trie.insert(1)).toBe(false);
      expect(trie.size()).toBe(0);
    });

    it('should not insert a word that is empty', () => {
      expect(trie.insert('')).toBe(false);
      expect(trie.size()).toBe(0);
    });

    it('should handle inserting a word that is a substring of another word', () => {
      trie.insert('hello');
      expect(trie.size()).toBe(1);
      trie.insert('hell');
      expect(trie.size()).toBe(2);
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('hell')).toBe(true);
    });
  });

  describe('search', () => {
    it('should return true if the word is in the trie', () => {
      trie.insert(word1);
      expect(trie.search(word1)).toBe(true);
      expect(trie.search('hell')).toBe(false);
      expect(trie.search(word2)).toBe(false);
      expect(trie.search('')).toBe(false);
      expect(trie.search(1)).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a word from the trie', () => {
      trie.insert(word1);
      expect(trie.size()).toBe(1);
      trie.delete(word1);
      expect(trie.size()).toBe(0);
      expect(trie.search(word1)).toBe(false);
    });
  });
});

