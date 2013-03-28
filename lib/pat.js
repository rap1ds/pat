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

      if(_.isFunction(patt)) {
        if(patt === String) { patt = _.isString; }
        if(patt === Number) { patt = _.isNumber; }
        if(patt === Boolean) { patt = _.isBoolean; }
        if(patt === Array) { patt = _.isArray; }
        if(patt === Object) { patt = _.isObject; }
        return patt(arg);
      } else {
        return _.isEqual(patt, arg);
      }
    })
  });
  return matches[0];
}

function pat(f) {
  var patterns = [];
  var otherwise;

  if(f) {
    otherwise = f;
  }

  var wrapper = function() {
    var matchedPattern = match(patterns, _.toArray(arguments));

    if(matchedPattern) {
      return matchedPattern.clbk.apply(this, arguments);
    } else {
      if(otherwise) {
        return otherwise.apply(this, arguments);
      } else {
        throw new Error("Illegal arguments");
      }
    }
  }

  wrapper.caseof = function() {
    var clbk = _.last(arguments);
    var args = _.initial(arguments);
    patterns.push(Object.freeze({args: args, clbk: clbk}));
    return wrapper;
  };

  wrapper.otherwise = function(otherwiseFn) {
    otherwise = otherwiseFn;
    return wrapper;
  }
  
  return wrapper;
}

module.exports = pat;