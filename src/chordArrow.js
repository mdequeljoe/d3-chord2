import {path} from "d3-path";

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

export default function() {
  
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
    
    if (!context) context = buffer = path();
    
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

