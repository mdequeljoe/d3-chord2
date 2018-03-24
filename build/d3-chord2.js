(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-path'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, function (exports,d3Array,d3Path) { 'use strict';

  function compareValue(compare) {
    return function(a, b) {
      return compare(
        a.source.value + a.target.value,
        b.source.value + b.target.value
      );
    };
  }

  function chord2() {

    var padAngle = 0,
    arcGroups = null,
    chordSum = null,
    sortArcGroups = null,
    sortSubgroups = null,
    sortChords = null;
    
    function chord2(matrix) {
      
      var n = matrix.length,
      tau = Math.PI * 2,
      groupSums = [],
      groupIndex = d3Array.range(n),
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
      if (arcGroups){
        var arcn = arcGroups.length,
        ag = d3Array.range(arcn);
        arcGroupIndex = [].concat.apply([], arcGroups)
        for (i = 0; i < groupIndex.length; i++){
          if (arcGroupIndex.indexOf(groupIndex[i]) == -1) {
            arcGroupIndex.push(groupIndex[i])
            arcGroups.push(groupIndex[i])
          }
        }
      }
      // Compute the sum.
      k = 0, i = -1; while (++i < n) {
        x = 0, j = -1; while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3Array.range(n));
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
      if (sortArcGroups) {
        ag.sort(function(a, b) {                
          return sortArcGroups(arcGroupSums[a], arcGroupSums[b]);
        });
        //reset groupIndex
        var ags = [];
        ag.forEach(function(i){ags.push(arcGroups[i])})
        groupIndex = [].concat.apply([], ags)
        for (i = 0; i < n; i++){
          if (groupIndex.indexOf(arcGroupIndex[i]) == -1) {
            groupIndex.push(arcGroupIndex[i])
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

  function defaultTarget(d) {
    return d.target;
  }

  function defaultRadius(d) {
    return d.radius;
  }

  function defaultStartAngle(d) {
    return d.startAngle;
  }

  function defaultEndAngle(d) {
    return d.endAngle;
  }

  function constant(x){
    return function(){
      return x;
    }
  }

  function chordArrow() {
    
    var slice = Array.prototype.slice,
    halfPi = Math.PI / 2,
    cos = Math.cos,
    sin = Math.sin,
    source = null,
    target = defaultTarget,
    radius = defaultRadius,
    sourceRadius = null,
    targetRadius = null,
    startAngle = defaultStartAngle,
    endAngle = defaultEndAngle,
    context = null;
    
    function chordArrow() {
      
      var buffer,
      argv = slice.call(arguments),
      s = source ? source.apply(this, argv) : 0,
      t = target.apply(this, argv),
      sr = +radius.apply(this, (argv[0] = s, argv)),
      sa0 = startAngle.apply(this, argv) - halfPi,
      sa1 = endAngle.apply(this, argv) - halfPi,
      sm = (sa0 + sa1) / 2,
      sr2 = sourceRadius ? +sourceRadius.apply(this, (argv[0] = s, argv)) : sr - 20,
      sx0 = sr * cos(sa0),
      sy0 = sr * sin(sa0),
      sx1 = sr2 * cos(sm),
      sy1 = sr2 * sin(sm),
      tr = +radius.apply(this, (argv[0] = t, argv)),
      ta0 = startAngle.apply(this, argv) - halfPi,
      ta1 = endAngle.apply(this, argv) - halfPi,
      tm = (ta0 + ta1) / 2,
      tr2 = targetRadius ? +targetRadius.apply(this, (argv[0] = t, argv)) : tr + 20,
      tx0 = tr  * cos(ta0),
      ty0 = tr  * sin(ta0),
      tx1 = tr2 * cos(tm),
      ty1 = tr2 * sin(tm);
      
      if (!context) context = buffer = d3Path.path();
      
      //target arrow
      if (typeof t === "object"){
        context.moveTo(tx0, ty0)
        context.arc(0, 0, tr, ta0, ta1)
        context.lineTo(tx1, ty1)
        context.lineTo(tx0, ty0)
      }
      
      //source arrow
      if (typeof s === "object"){
        context.moveTo(sx0, sy0)
        context.arc(0, 0, sr, sa0, sa1)
        context.lineTo(sx1, sy1)
        context.lineTo(sx0, sy0)
      }
      
      context.closePath();
      if (buffer) return context = null, buffer + "" || null;
    }
    
    chordArrow.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), chordArrow) : radius;
    };
    
    chordArrow.sourceRadius = function(_) {
      return arguments.length ? (sourceRadius= typeof _ === "function" ? _ : constant(+_), chordArrow) : sourceRadius;
    };
    
    chordArrow.targetRadius = function(_) {
      return arguments.length ? (targetRadius= typeof _ === "function" ? _ : constant(+_), chordArrow) : targetRadius;
    };
    
    chordArrow.source = function(_) {
      return arguments.length ? (source = _, chordArrow) : source;
    };
    
    chordArrow.target = function(_) {
      return arguments.length ? (target = _, chordArrow) : target;
    };
    
    
    chordArrow.context = function(_) {
      return arguments.length ? ((context = _ == null ? null : _), chordArrow) : context;
    };
    
    return chordArrow
    
  }

  exports.chord2 = chord2;
  exports.chordArrow = chordArrow;

  Object.defineProperty(exports, '__esModule', { value: true });

}));