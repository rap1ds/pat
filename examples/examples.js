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

module.exports = Object.freeze({
  pow1: pow1,
  pow2: pow2,
  pow3: pow3,
  pow4: pow4
});