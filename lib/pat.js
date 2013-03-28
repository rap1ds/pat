/*
 * pat
 * https://github.com/mikko/pat
 *
 * Copyright (c) 2013 Mikko Koski
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");

function last(arr) {
  return arr.slice(-1)[0];
}

function initial(arr) {
  return arr.slice(0, -1);
}

function toArray(args) {
  return Array.prototype.slice.call(args);
}

function match(patterns, args) {
  var matches = patterns.filter(function(pattern) {
    return pattern.args.length === args.length && _.every(_.zip(pattern.args, args), function(zipped) {
      var patt = zipped[0], arg = zipped[1];
      return _.isFunction(patt) ? patt(arg) : _.isEqual(patt, arg);
    })
  });
  return matches[0];
}

function pat(f) {
  var patterns = [];

  if(!f) {
    f = function() {};
  }

  var wrapper = function() {
    var matchedPattern = match(patterns, toArray(arguments));

    if(matchedPattern) {
      return matchedPattern.clbk.apply(this, arguments);
    } else {
      return f.apply(this, arguments);
    }
  }

  wrapper.caseof = function() {
    var args = toArray(arguments);
    var clbk = last(args);
    args = initial(args);
    patterns.push(Object.freeze({args: args, clbk: clbk}));
    return wrapper;
  };
  
  return wrapper;
}

module.exports = pat;
