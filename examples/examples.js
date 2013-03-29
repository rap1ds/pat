var pat = require("../lib/pat");
var _ = require("lodash");

function pow1(x, y) {
  if(!_.isNumber(x) || !_.isNumber(y)) {
    throw new Error("Illegal arguments");
  } else if(y === 0) {
    return 1;
  } else {
    var n = x;
    for(var i = 1; i < y; i++) {
      n = n * x;
    }
    return n;
  }
}

function pow2(x, y) {
  if(!_.isNumber(x) || !_.isNumber(y)) {
    throw new Error("Illegal arguments");
  } else if(y === 0) {
    return 1;
  } else {
    return x * pow1(x, y - 1);
  }
}

var pow3 = pat()
  .caseof(Number, 0, function() { return 1; })
  .caseof(Number, Number, function(x, y) { 
    return x * pow2(x, y - 1 ); 
  });

var pow4 = pat(function(x, y) {
    return x * pow3(x, y - 1); 
  }).caseof(Number, 0, function() {
    return 1;
  });

/*
  Let's write a `sum` function, which returns the sum of the given
  arguments. It is very liberal with the arguments, and can take the following:

  - any number of ints
  - int array
  - any number of strings
  - string array

  If no arguments is given to `sum`, return 0
  If empty array is given, return 0

  Otherwise, throw "Illegal arguments" exception

  Usage:

  sum(0, 1, 2, 3, 4, 5) === 15;
  sum("0", "1", "2", "3", "4", "5") === 15;
  sum([0, 1, 2, 3, 4, 5]) === 15;
  sum(["0", "1", "2", "3", "4", "5"]) === 15;
  sum() === 0;
  sum([]) === 0;

*/

var arrayOf = function(fn) {
  return function(arr) {
    return arr.every(fn);
  }
}

var sum = pat()
  .caseof(function() { return 0 })
  .caseof([], function() { return 0 })
  .caseof(pat.rest(_.isString), function(rest) {
    return sum(rest); })
  .caseof(pat.rest(_.isNumber), function(rest) { 
    return sum(rest); })
  .caseof(arrayOf(_.isString), function(stringArray) { 
    return sum(stringArray.map(function(n) { 
      return parseInt(n, 10); }));
  })
  .caseof(arrayOf(_.isNumber), function(intArray) {
    return intArray.reduce(function(a, b) { return a + b }, 0);
  });

module.exports = Object.freeze({
  pow1: pow1,
  pow2: pow2,
  pow3: pow3,
  pow4: pow4,
  sum: sum
});