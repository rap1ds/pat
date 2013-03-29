/*
 * pat
 * https://github.com/mikko/pat
 *
 * Copyright (c) 2013 Mikko Koski
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");

/* pack rest arguments to an array */
function packRestArguments(pattern, args) {
  if(!pattern.rest) {
    return args;
  } else {
    var firstArgs = _.head(args, pattern.args.length);
    var restArgs = _.tail(args, pattern.args.length);
    firstArgs.push(restArgs);
    return firstArgs;
  }
}

function matchArgument(patt, arg) {
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
}

function matchFirstArguments(pattern, args) {
  var lengthMustMatch = !pattern.rest; // arg length must match if no rest
  var lengthOk = lengthMustMatch ? pattern.args.length === args.length : true;

  var patternArgs = _.first(args, pattern.args.length);

  return lengthOk && _.every(_.zip(pattern.args, patternArgs), function(zipped) {
    var patt = zipped[0], arg = zipped[1];
    return matchArgument(patt, arg);
  });
}

function matchRestArguments(pattern, args) {
  var rest = pattern.rest;
  if(!rest) {
    return true;
  }
  var restArgs = _.tail(args, pattern.args.length);
  return restArgs.every(function(arg) {
    return matchArgument(rest, arg);
  });
}

function match(patterns, args) {
  var matches = patterns.filter(function(pattern) {
    return matchFirstArguments(pattern, args) && matchRestArguments(pattern, args);
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
      return matchedPattern.clbk.apply(this, packRestArguments(matchedPattern, arguments));
    } else {
      if(otherwise) {
        return otherwise.apply(this, arguments);
      } else {
        throw new Error("Illegal arguments");
      }
    }
  }

  wrapper.caseof = function() {
    var clbk = _.last(arguments)
      , args = _.initial(arguments)
      , restCandidate = _.last(args) || {}
      , rest;
      
    if(restCandidate.__pat_rest) {
      rest = restCandidate();
      args = _.initial(args);
    }

    patterns.push(Object.freeze({args: args, rest: rest, clbk: clbk}));
    return wrapper;
  };

  wrapper.otherwise = function(otherwiseFn) {
    otherwise = otherwiseFn;
    return wrapper;
  }
  
  return wrapper;
}

// Match any
pat._ = function() { return true };

// Match rest
/* If called with some arguments, return function which returns the arguments 
   when called.
*/
pat.rest = function() {
  var args = _.toArray(arguments);
  if(!args.length) {
    return;
  } else {
    var fn = function() {
      return args[0]; // Ignore all but first
    };
    fn.__pat_rest = true;
    return fn;
  }
}

pat.rest.__pat_rest = true;

module.exports = pat;