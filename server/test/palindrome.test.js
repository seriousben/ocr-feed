const assert = require('assert');

const { isPalindrome, TYPES: palindromImplTypes } = require('../palindrome');

const palindromes = [
  'aa', 'a', 'aba', 'abba', 'ab ba',
  'hannah', 'redivider', 'noon', 'civic', 'radar', 'level', 'rotor',
  'kayak', 'reviver', 'racecar', 'redder', 'madam', 'refer'
];
const notPalindromes = ['foo', 'bar', 'is this a palindrome?'];

describe('palindrome', function() {
  describe('positives', function() {
    palindromes.forEach((word) => {
      palindromImplTypes.forEach((implType) => {
        it(`${word} is a palindrome (${implType})`, function() {
          assert.ok(isPalindrome(word, implType));
        });
      });
    });
  });

  describe('negatives', function() {
    notPalindromes.forEach((word) => {
      palindromImplTypes.forEach((implType) => {
        it(`${word} is NOT a palindrome (${implType})`, function() {
          assert.ok(!isPalindrome(word, implType));
        });
      });
    });
  });
});
