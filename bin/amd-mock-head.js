if (this.define == null) {
  this.define = function(name, dependencies, fn){
    var root, ref$, args, res$, i$, len$, dep, depVariable;
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    res$ = [];
    for (i$ = 0, len$ = dependencies.length; i$ < len$; ++i$) {
      dep = dependencies[i$];
      res$.push(eval(depVariable = dep.match(/[a-zA-Z0-9_-]+$/)[0]));
    }
    args = res$;
    return import$(root, fn.apply(this, args));
  };
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}