import {range} from "d3-array";
function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

export default function() {

  var padAngle = 0,
  arcGroups = null,
  chordSum = null,
  sortArcGroups = null,
  sortSubgroups = null,
  sortChords = null;
  
  function chord2(matrix) {
    
    var n = matrix.length,
    arcn = arcGroups.length,
    ag = range(arcn),
    tau = Math.PI * 2,
    groupSums = [],
    groupIndex = range(n),
    arcGroupIndex = [],
    arcGroupSums = [],
    subgroupIndex = [],
    chords = [],
    groups = chords.groups = new Array(n),
    subgroups = new Array(n * n),
    x,
    x0,
    i,
    j,
    g,
    sj = 0,
    gs = 0,
    k,
    k0,
    dx,
    dxIndex = [];
    
    //add in any groups (rows) not specified under arcGroups
    // to arcGroups and arcGroupsIndex
    arcGroupIndex = [].concat.apply([], arcGroups)
    for (i = 0; i < groupIndex.length; i++){
      if (arcGroupIndex.indexOf(groupIndex[i]) == -1) {
        arcGroupIndex.push(groupIndex[i])
        arcGroups.push(groupIndex[i])
      }
    }
    // Compute the sum.
    k = 0, i = -1; while (++i < n) {
      x = 0, j = -1; while (++j < n) {
        x += matrix[i][j];
      }
      groupSums.push(x);
      subgroupIndex.push(range(n));
      k += x;
    }
    // Convert the sum to scaling factor for [0, 2pi].
    // scale by chordSum - adjust dx to space groups evenly
    if (chordSum) {
      k0 = k;
      k = (chordSum > k0) ? chordSum: k;
    }
    //need to account for uneven groupings
    if (arcGroups) k = Math.max(0, tau - padAngle * (n - arcn)) / k;
    else k = Math.max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;
    if (chordSum) dx = (tau - padAngle - k0 * k) / arcn
    
    if (arcGroups){
      //calc sum for arc groups
      //set dx for each group according to arcGroup and shift forward one
      for (i = 0; i < arcGroups.length; i++){
        g = (arcGroups[i].length) ? arcGroups[i].length : 1
        for (j = 0; j < g; j++){
          sj += groupSums[gs]
          gs++
          if (i < 1 || j > 0) dxIndex.push(0)
          else dxIndex.push(dx)
        }
        arcGroupSums.push(sj)
        sj = 0;
      }
      dxIndex.shift()
      dxIndex.push(0)
      groupIndex = arcGroupIndex
    }
    
    //sort groups replaced by sortArcGroups ?
    //this needs to be fixed...
    if (sortArcGroups) {
      ag.sort(function(a, b) {                
        return sortArcGroups(arcGroupSums[a], arcGroupSums[b]);
      });
      var ags = [];
      ag.forEach(function(i){ags.push(arcGroups[i])})
      groupIndex = [].concat.apply([], ags)
      var t = range(n);
      for (i = 0; i < n; i++){
        if (groupIndex.indexOf(t[i]) == -1) {
          groupIndex.push(i)
        }
      }        
    }
    // Sort subgroups…
    if (sortSubgroups) subgroupIndex.forEach(function(d, i) {
      d.sort(function(a, b) {
        return sortSubgroups(matrix[i][a], matrix[i][b]);
      });
    });
    
    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    x = 0, i = -1; while (++i < n) {
      x0 = x, j = -1; while (++j < n) {
        var di = groupIndex[i],
        dj = subgroupIndex[di][j],
        v = matrix[di][dj],
        a0 = x,
        a1 = x += v * k;
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      if (arcGroups) x += dxIndex[i]
      else x += dx;
    }
    
    
    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1; while (++i < n) {
      j = i - 1; while (++j < n) {
        var source = subgroups[j * n + i],
        target = subgroups[i * n + j];
        if (source.value || target.value) { 
          chords.push(source.value < target.value
            ? {source: target, target: source}
            : {source: source, target: target});
        }
      }
    }
      
    return sortChords ? chords.sort(sortChords) : chords
      
  }
    
    chord2.padAngle = function(_) {
      return arguments.length ? (padAngle = Math.max(0, _), chord2) : padAngle;
    };
    
    chord2.arcGroups = function(_){
      return arguments.length ? ((arcGroups = _), chord2) : arcGroups;
    };
    
    chord2.chordSum = function(_){
      return arguments.length ? (chordSum = _, chord2) : chordSum;
    }
    
    chord2.sortArcGroups = function(_) {
      return arguments.length ? (sortArcGroups = _, chord2) : sortArcGroups;
    };
    
    chord2.sortSubgroups = function(_) {
      return arguments.length ? (sortSubgroups = _, chord2) : sortSubgroups;
    };
    
    chord2.sortChords = function(_) {
      return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord2) : sortChords && sortChords._;
    };
    
    return chord2
  
}
  

