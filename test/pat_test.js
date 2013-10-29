/*jshint node:true */

"use strict";

var pat = require("../lib/pat");
var expect = require("expect.js");
var _ = require("lodash");

describe("pat", function(){
  it("returns a function", function() {
    expect(pat()).to.be.a("function");
  });

  it("returns the given function as it is", function() {
    var f = function() { return "f"; };
    expect(pat(f)()).to.be("f");
  });

  it("extends the function with 'caseof' function", function() {
    var f = function() {};
    expect(pat(f).caseof).to.be.a("function");
  });

  it("passes 'self' as the last argument", function() {
    var f1 = function(first, second, self) {
      expect(self).to.be(f2);
    };

    var f2 = pat().caseof("first", "second", f1);

    f2("first", "second");
  });

  it("creates a pattern", function() {
    expect(pat.pat(Number, Number)).to.eql({
      args: [Number, Number], 
      rest: undefined, 
      all: undefined, 
      __pat_pattern: true
    });
    
    // Sugar
    expect(pat(Number, Number)).to.eql({
      args: [Number, Number], 
      rest: undefined, 
      all: undefined,
      __pat_pattern: true
    });
  });
});

describe("caseof", function() {
  it("matches primitives", function() {
    var fInt = function() { return "fInt"; };
    var fStr = function() { return "fStr"; };
    var fBool = function() { return "fBool"; };
    var fArr = function() { return "fArr"; };
    var fObj = function() { return "fObj"; };
    var matchInt = function() { return "matchInt"; };
    var matchStr = function() { return "matchStr"; };
    var matchBool = function() { return "matchBool"; };
    var matchArr = function() { return "matchArr"; };
    var matchObj = function() { return "matchObj"; };

    fInt = pat(fInt).caseof(1, matchInt);
    fStr = pat(fStr).caseof("foo", matchStr);
    fBool = pat(fBool).caseof(true, matchBool);
    fArr = pat(fArr).caseof(["foo", "bar"], matchArr);
    fObj = pat(fObj).caseof({"foo": "bar"}, matchObj);

    expect(fInt(0)).to.equal("fInt");
    expect(fInt(1)).to.equal("matchInt");
    expect(fStr("bar")).to.equal("fStr");
    expect(fStr("foo")).to.equal("matchStr");
    expect(fBool(false)).to.equal("fBool");
    expect(fBool(true)).to.equal("matchBool");
    expect(fArr(["foo", "baz"])).to.equal("fArr");
    expect(fArr(["foo", "bar"])).to.equal("matchArr");
    expect(fObj({"foo": "baz"})).to.equal("fObj");
    expect(fObj({"foo": "bar"})).to.equal("matchObj");
  });

  it("matches multiple arguments", function() {
    var f1 = function() { return "f1"; };
    var match = function() { return "match"; };

    f1 = pat(f1).caseof(0, 1, match);

    expect(f1(0)).to.equal("f1");
    expect(f1(1)).to.equal("f1");
    expect(f1(0, 0)).to.equal("f1");
    expect(f1(0, 1)).to.equal("match");
  });

  it("matches multiple caseofs", function() {
    var f1 = function() { return "f1"; };
    var match1 = function() { return "match1"; };
    var match2 = function() { return "match2"; };

    f1 = pat(f1)
      .caseof(0, 1, match1)
      .caseof(1, 1, match2);

    expect(f1(0, 0)).to.equal("f1");
    expect(f1(0, 1)).to.equal("match1");
    expect(f1(1, 1)).to.equal("match2");
  });

  it("matches function", function() {
    var f1 = function() { return "f1"; };
    var match = function() { return "match"; };

    f1 = pat(f1).caseof(_.isNumber, match);

    expect(f1("foo")).to.equal("f1");
    expect(f1(1)).to.equal("match");
  });

  it("matches any", function() {
    var f1 = function() { return "f1"; };
    var match = function() { return "match"; };

    f1 = pat(f1).caseof(pat._, _.isNumber, match);

    expect(f1("foo", "foo")).to.equal("f1");
    expect(f1(1, 1)).to.equal("match");
    expect(f1(null, 1)).to.equal("match");
    expect(f1({"foo": "bar"}, 1)).to.equal("match");
  });

  it("matches no args", function() {
    var f1 = function() { return "f1"; };
    var match = function() { return "match"; };

    f1 = pat(f1).caseof(match);

    expect(f1("foo")).to.equal("f1");
    expect(f1()).to.equal("match");
  });

  it("matches primitive constructors", function() {
    var fInt = function() { return "fInt"; };
    var fStr = function() { return "fStr"; };
    var fBool = function() { return "fBool"; };
    var fArr = function() { return "fArr"; };
    var fObj = function() { return "fObj"; };
    var matchInt = function() { return "matchInt"; };
    var matchStr = function() { return "matchStr"; };
    var matchBool = function() { return "matchBool"; };
    var matchArr = function() { return "matchArr"; };
    var matchObj = function() { return "matchObj"; };

    fInt = pat(fInt).caseof(Number, matchInt);
    fStr = pat(fStr).caseof(String, matchStr);
    fBool = pat(fBool).caseof(Boolean, matchBool);
    fArr = pat(fArr).caseof(Array, matchArr);
    fObj = pat(fObj).caseof(Object, matchObj);

    expect(fInt(0)).to.equal("matchInt");
    expect(fInt(1)).to.equal("matchInt");
    expect(fStr("bar")).to.equal("matchStr");
    expect(fStr("foo")).to.equal("matchStr");
    expect(fBool(false)).to.equal("matchBool");
    expect(fBool(true)).to.equal("matchBool");
    expect(fArr(["foo", "baz"])).to.equal("matchArr");
    expect(fArr(["foo", "bar"])).to.equal("matchArr");
    expect(fObj({"foo": "baz"})).to.equal("matchObj");
    expect(fObj({"foo": "bar"})).to.equal("matchObj");
  });

  it("throws, if no match", function() {
    var fn = function() {};
    var match = function() { return "match"; };

    var f1 = pat(fn)
      .caseof(_.isNumber, match);

    var f2 = pat()
      .caseof(_.isNumber, match);

    var f3 = pat()
      .caseof(_.isNumber, match)
      .otherwise(fn);

    expect(function() { f1("foo"); }).not.to.throwError();
    expect(function() { f2("foo"); }).to.throwError();
    expect(function() { f3("foo"); }).not.to.throwError();
  });

  it("matches all rest", function() {
    var fn = function() { return "fn"; };
    var match = function() { return "match"; };

    var f1 = pat(fn)
      .caseof(pat.rest(_.isNumber), match);

    var f2 = pat(fn)
      .caseof("foo", "bar", pat.rest(_.isNumber), match);
    expect(f1("foo")).to.equal("fn");
    expect(f1(1, 2, 3)).to.equal("match");
    expect(f2("foo", "bar", 1, 2, 3)).to.equal("match");
    expect(f2("foo", "bar", 1, 2, 3, true)).to.equal("fn");
  });

  it("passes if rest doesn't have matcher", function() {
    var fn = function() { return "fn"; };
    var match = function() { return "match"; };
    var fooMatch = function() { return "foo match"; };

    var f1 = pat(fn)
      .caseof(pat.rest(), match);

    var f2 = pat(fn)
      .caseof("foo", "bar", pat.rest(), fooMatch);

    expect(f1("foo")).to.equal("match");
    expect(f1(1, 2, "something else")).to.equal("match");
    expect(f2("foo", "bar", 1, 2, 3)).to.equal("foo match");
    expect(f2("foo", "bar", 1, 2, 3, true)).to.equal("foo match");
  });

  it("packs all rest args to array", function() {
    var fn = function() { return "fn"; };
    var match = function(first, second, rest) { return rest; };
    var matchAll = function(rest) { return rest; };

    var f1 = pat(fn)
      .caseof(Number, Number, pat.rest(_.isNumber), match);
    var f2 = pat(fn)
      .caseof(pat.rest(), matchAll);

    expect(f1(1)).to.equal("fn");
    expect(f1(1, 2)).to.eql([]);
    expect(f1(1, 2, 3, 4, 5)).to.eql([3, 4, 5]);

    expect(f2(1)).to.eql([1]);
    expect(f2(1, 2)).to.eql([1, 2]);
    expect(f2(1, 2, 3, 4, 5)).to.eql([1, 2, 3, 4, 5]);
  });

  it("matches all at once", function() {
    var matchThreeWords = function(all) { return all.join("") === "one two three"; };

    var matched = function() {
      return "matched";
    };

    var fn = pat()
      .caseof(pat.all(matchThreeWords), matched);

    expect(fn("one ", "tw", "o three")).to.equal("matched");
  });

  it("packs all args to array", function() {
    var fn = function() { return "fn"; };
    var matchThreeWords = function(all) { return all.join("") === "one two three"; };
    var match = function(all) { return all; };

    var f1 = pat(fn)
      .caseof(pat.all(matchThreeWords), match);

    expect(f1("one ", "two")).to.equal("fn");
    expect(f1("one ", "t", "wo three")).to.be.eql(["one ", "t", "wo three"]);
  });

  it("allows matcher function to return value", function() {
    var f1 = function() { return "no match"; };
    var head = function(arr) {
      if(_.isArray(arr)) {
        return pat.val(arr[0]);
      }
    };

    f1 = pat(f1).caseof(head, _.identity);

    expect(f1(1, 2, 3)).to.equal("no match");
    expect(f1([1, 2, 3])).to.equal(1);
  });

  it("allows matcher function to return different number of arguments", function() {
    var f1 = function() { return "no match"; };
    var range = function(arr) {
      if(_.isArray(arr) && arr.length === 2) {
        return pat.val.apply(null, _.range(arr[0], arr[1]));
      }
    };

    f1 = pat(f1).caseof("test1", range, "test2", _.identity);

    expect(f1(1, 5)).to.equal("no match");
    expect(f1("test1", [1, 5], "test2")).to.equal("test1", 1, 2, 3, 4, 5, "test2");
  });

  it("allows nested pattern", function() {
    var fn = function() { return "no match"; };

    var f1 = pat(fn)
      .caseof(pat(Number, Number), function(a, b) {
        return "got numbers " + a + " and " + b;
      });

    expect(f1(1, 2)).to.equal("no match");
    expect(f1([1])).to.equal("no match");
    expect(f1([1, 2])).to.equal("got numbers 1 and 2");
  });

  it("allows nested pattern inside nested pattern", function() {
    var fn = function() { return "no match"; };

    var f1 = pat(fn)
      .caseof(pat(
        pat(Number, Number), 
        pat(Number, Number), 
        pat(Number, Number)), function(x1, y1, x2, y2, x3, y3) {
        return "got points (1, 2), (3, 4), (5, 6)";
      });

    expect(f1(1, 2, 3, 4, 5, 6)).to.equal("no match");
    expect(f1([1, 2, 3, 4, 5, 6])).to.equal("no match");
    expect(f1([ [1, 2], [3, 4], [5, 6] ])).to.equal("got points (1, 2), (3, 4), (5, 6)");

    var max = pat()
      .caseof(pat(Number), function(x) {
        return x;
      })
      .caseof(pat(Number, pat.rest()), function(x, xs) {
        var xsMax = max(xs);
        return x > xsMax ? x : xsMax;
      });

    expect(max([5, 3, 7, 9, 3, 7, 8, 3, 5])).to.equal(9);
  });

  it("allows sugarred nested pattern inside nested pattern", function() {
    var fn = function() { return "no match"; };

    var f1 = pat(fn)
      .caseof([[Number, Number], [Number, Number], [Number, Number]], function(x1, y1, x2, y2, x3, y3) {
        return ["got points (", x1, y1, "), (", x2, y2, "), (", x3, y3, ")"].join(" ");
      });

    expect(f1(1, 2, 3, 4, 5, 6)).to.equal("no match");
    expect(f1([1, 2, 3, 4, 5, 6])).to.equal("no match");
    expect(f1([ [1, 2], [3, 4], [5, 6] ])).to.equal("got points ( 1 2 ), ( 3 4 ), ( 5 6 )");

    var max = pat()
      .caseof([Number], function(x) {
        return x;
      })
      .caseof([Number, pat.rest()], function(x, xs) {
        var xsMax = max(xs);
        return x > xsMax ? x : xsMax;
      });

    expect(max([5, 3, 7, 9, 3, 7, 8, 3, 5])).to.equal(9);
  });
});