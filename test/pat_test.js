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
});

describe("caseof", function() {
  it("matches primitives", function() {
    var fInt = function() { return "fInt" };
    var fStr = function() { return "fStr" };
    var fBool = function() { return "fBool" };
    var fArr = function() { return "fArr" };
    var fObj = function() { return "fObj" };
    var matchInt = function() { return "matchInt" };
    var matchStr = function() { return "matchStr" };
    var matchBool = function() { return "matchBool" };
    var matchArr = function() { return "matchArr" };
    var matchObj = function() { return "matchObj" };

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
    var f1 = function() { return "f1" };
    var match = function() { return "match" };

    f1 = pat(f1).caseof(0, 1, match);

    expect(f1(0)).to.equal("f1");
    expect(f1(1)).to.equal("f1");
    expect(f1(0, 0)).to.equal("f1");
    expect(f1(0, 1)).to.equal("match");
  });

  it("matches multiple caseofs", function() {
    var f1 = function() { return "f1" };
    var match1 = function() { return "match1" };
    var match2 = function() { return "match2" };

    f1 = pat(f1)
      .caseof(0, 1, match1)
      .caseof(1, 1, match2);

    expect(f1(0, 0)).to.equal("f1");
    expect(f1(0, 1)).to.equal("match1");
    expect(f1(1, 1)).to.equal("match2");
  });

  it("matches function", function() {
    var f1 = function() { return "f1" };
    var match = function() { return "match" };

    f1 = pat(f1).caseof(_.isNumber, match);

    expect(f1("foo")).to.equal("f1");
    expect(f1(1)).to.equal("match");
  })
})