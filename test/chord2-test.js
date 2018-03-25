var tape = require("tape"),
d3 = require("../");

// From http://mkweb.bcgsc.ca/circos/guide/tables/
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];

var groups = [[0, 1], [2, 3]]

tape("d3.chord2() has the expected defaults", function(test) {
  var cd = d3.chord2();
  test.equal(cd.padAngle(), 0);
  test.equal(cd.arcGroups(), null);
  test.equal(cd.sortArcGroups(), null);
  test.equal(cd.chordSum(), null);
  test.end();
});

function calcSpanScale(m, c){
  var p = [], s = 0;
  c(m).groups.forEach(function(d){
    s += d.endAngle - d.startAngle
  })
  c(m).groups.forEach(function(d){
    var t = (d.endAngle - d.startAngle) / s
    p.push(t.toFixed(10))
  })
  return p;
}

tape("chord.arcGroups preserves proportional lengths", function(test) {
  var groupedChord = d3.chord2()
  .padAngle(0.2)
  .arcGroups(groups)
  
  var chord = d3.chord2()
  .padAngle(0.2)
  
  gs = calcSpanScale(matrix, groupedChord);
  cs = calcSpanScale(matrix, chord);
  
  test.equal(gs[0], cs[0]);
  test.equal(gs[1], cs[1]);
  test.equal(gs[2], cs[2]);
  test.equal(gs[3], cs[3]);
  test.end();
});