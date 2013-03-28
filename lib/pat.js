/*
 * pat
 * https://github.com/mikko/pat
 *
 * Copyright (c) 2013 Mikko Koski
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");

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
    var matchedPattern = match(patterns, _.toArray(arguments));

    if(matchedPattern) {
      return matchedPattern.clbk.apply(this, arguments);
    } else {
      return f.apply(this, arguments);
    }
  }

  wrapper.caseof = function() {
    var clbk = _.last(arguments);
    var args = _.initial(arguments);
    patterns.push(Object.freeze({args: args, clbk: clbk}));
    return wrapper;
  };
  
  return wrapper;
}

module.exports = pat;
