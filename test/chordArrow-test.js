var tape = require("tape"),
d3 = require("../");

tape("d3.chordArrow() has the expected defaults", function(test) {
  var ca = d3.chordArrow();
  test.equal(ca.radius()({radius: 42}), 42);
  test.equal(ca.sourceRadius(), null);
  test.equal(ca.targetRadius(), null);
  test.equal(ca.source(), null);
  test.deepEqual(ca.target()({target: {name: "foo"}}), {name: "foo"});
  test.equal(ca.context(), null);
  test.end();
});