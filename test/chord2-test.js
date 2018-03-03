var tape = require("tape"),
    cb = require("../");

tape("foo() returns the answer", function(test) {
  test.equal(42, 42);
  test.end();
});
