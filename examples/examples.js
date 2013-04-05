var pat = require("../lib/pat");
var _ = require("lodash");

function pow1(x, y) {
  if(!_.isNumber(x) || !_.isNumber(y)) {
    throw new Error("Illegal arguments");
  } else if(y === 0) {
    return 1;
  } else {
    var isNegative = y < 0;
    y = y < 0 ? y * (-1) : y;
    var n = x;
    for(var i = 1; i < y; i++) {
      n = n * x;
    }
    return isNegative ? 1 / n : n;
  }
}

function pow2(x, y) {
  if(!_.isNumber(x) || !_.isNumber(y)) {
    throw new Error("Illegal arguments");
  } else if(y === 0) {
    return 1;
  } else {
    var isNegative = y < 0;
    y = y < 0 ? y * (-1) : y;
    var result = x * pow2(x, y - 1);
    return isNegative ? 1 / result : result;
  }
}

function lessThan(a) {
  return function(b) {
    return _.isNumber(b) && b < a;
  }
}

var pow3 = pat()
  .caseof(Number, 0, function() { return 1; })
  .caseof(Number, lessThan(0), function(x, y) { return 1 / pow3(x, (y * (-1))) })
  .caseof(Number, Number, function(x, y) { 
    return x * pow3(x, y - 1 ); 
  });

var pow4 = pat(function(x, y) {
    return x * pow4(x, y - 1); 
  })
  .caseof(Number, 0, function() {
    return 1;
  })
  .caseof(Number, lessThan(0), function(x, y) {
    return 1 / pow4(x, (y * (-1)));
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

function sum1() {
  var args = _.toArray(arguments);

  if(!args.length) {
    return 0;
  } 
  if(_.isArray(args[0])) {
    args = args[0];
  } 
  if(args.every(_.isString)) {
    args = args.map(function(n) { return parseInt(n, 10)});
  }
  if(args.every(_.isNumber)) {
    return args.reduce(function(a, b) { return a + b }, 0);
  } else {
    throw "Illegal arguments";
  }
}

var arrayOf = function(fn) {
  return function(arr) {
    return arr.every(fn);
  }
}

var sum2 = pat()
  .caseof(function() { return 0 })
  .caseof([], function() { return 0 })
  .caseof(pat.rest(_.isString), function(rest) {
    return sum2(rest); })
  .caseof(pat.rest(_.isNumber), function(rest) {
    return sum2(rest); })
  .caseof(arrayOf(_.isString), function(stringArray) {
    return sum2(stringArray.map(function(n) {
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
  sum1: sum1,
  sum2: sum2
});