# d3-chord2

d3-chord2 forks d3-chord in order to provide minor extensions to [d3-chord](https://github.com/d3/d3-chord) such as grouped arcs and target or source arrows for directionality. 

## Installing
...
```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="d3-chord2.js"></script>
<script>

var chord = d3.chord2();

</script>
```
## Note

Work in progress and not on npm - and still needs proper testing. Feedback welcome.


## API Reference

d3-chord2 builds on the API of [d3-chord](https://github.com/d3/d3-chord)

<a href="#chord2" name="chord2">#</a> d3.<b>chord2</b>() [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js "Source")

Constructs a new chord layout with the default settings. 

<a href="#chord_arcGroups" name="#chord_arcGroups">#</a> <i>chord2</i>.<b>arcGroups</b>([<i>matrix</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L168 "Source")

if <i>arcGroups</i> is specified, the chord groups indices specified in the subarrays will be connected (i.e. 0 padAngle between these groupings). Any group indices left unspecified will be laid out according to <i>padAngle</i>. Of course, if <i>padAngle</i> is set to zero then the arc groupings will not be seen. Note that by default, the arc groups will be ordered according to the order of arrays specified in group <i>matrix</i>.

<a href="#chord_sortArcGroups" name="#chord_sortArcGroups">#</a> <i>chord2</i>.<b>sortArcGroups</b>([<i>compare</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L176 "Source")

If <i>compare</i> is specified, sets the arc group comparator to the specified function or null and returns this chord layout. If compare is not specified, returns the current arc group comparator, which defaults to null. If the group comparator is non-null, it is used to sort the arc groups by the sum of the included groups. Note that groups not included in the group matrix will not be sorted.

<a href="#chord_chordSum" name="#chord_chordSum">#</a> <i>chord2</i>.<b>chordSum</b>([<i>sum</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L172 "Source")

If <i>chordSum</i> is specified, scales chord groups according to this sum, rather than the sum of the groups specified in the data <i>matrix</i>. Note that <i>chordSum</i> must be greater than this input matrix sum. 

<a href="#chordArrow" name="chordArrow">#</a> d3.<b>chordArrow</b>() [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chordArrow.js "Source")

Constructs a new chord layout with the default settings. 

<a href="#chordArrow_radius" name="#chordArrow_radius">#</a> <i>chordArrow</i>.<b>radius</b>([<i>radius</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L168 "Source")

See [ribbon.radius](https://github.com/d3/d3-chord#ribbon_radius)

<a href="#chordArrow_target" name="#chordArrow_target">#</a> <i>chordArrow</i>.<b>target</b>([<i>compare</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L176 "Source")

See [ribbon.target](https://github.com/d3/d3-chord#ribbon_target)

<a href="#chordArrow_targetRadius" name="#chordArrow_targetRadius">#</a> <i>chordArrow</i>.<b>targetRadius</b>([<i>targetRadius</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L176 "Source")

to do

<a href="#chordArrow_source" name="#chordArrow_source">#</a> <i>chordArrow</i>.<b>source</b>([<i>source</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L172 "Source")

See [ribbon.source](https://github.com/d3/d3-chord#ribbon_source)

<a href="#chordArrow_sourceRadius" name="#chordArrow_sourceRadius">#</a> <i>chordArrow</i>.<b>sourceRadius</b>([<i>sourceRadius</i>]) [<>](https://github.com/mdequeljoe/d3-chord2/blob/master/src/chord2.js#L172 "Source")

to do

