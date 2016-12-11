const cppIsPalindrome = require('palindrome');

const PALINDROME_IMPL = {
  /**
   * c++ palindrome approach
   *
   * Third party MIT library
   * https://github.com/zzarcon/palindrome
   *
   * Forked to add some tests :)
   * https://github.com/seriousben/palindrome/tree/add-tests
   *
   * It ignores spaces
   */
  native(str) {
    return cppIsPalindrome(str);
  },

  /**
   * Naive javascript approach
   */
  js(str) {
    if (!str) {
      return false;
    }
    if (str.length === 1) {
      return true;
    }

    // naive approach
    for (let i = 0; i !== str.length; i++) {
      const startIndex = i;
      const endIndex = str.length - 1 - i;

      if (startIndex === endIndex) {
        return true;
      }

      const startChar = str[startIndex];
      const endChar = str[endIndex];

      if (startChar !== endChar) {
        return false; 
      }
    }

    return true;
  },
};

exports.TYPES = Object.keys(PALINDROME_IMPL);

exports.isPalindrome = function isPalindrome(str, _type) {
  const type = _type || 'native';

  const impl = PALINDROME_IMPL[type];

  if (!impl) {
    throw new Error(`Unknown isPalindrom implementation ${type}`);
  }

  return impl(str);
}
