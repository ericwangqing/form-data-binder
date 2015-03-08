(function(){
  var localRecoverier, root, ref$;
  localRecoverier = {
    activate: function(form){
      return this.form = $(form);
    }
  };
  if ((typeof define != 'undefined' && define !== null ? define.cmd : void 8) != null) {
    define('local-recoverier', function(){
      return localRecoverier;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.localRecoverier = localRecoverier;
  }
}).call(this);
