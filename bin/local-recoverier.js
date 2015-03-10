(function(){
  var SELECTOR, LocalRecoverier, localRecoverierManager, root, ref$;
  SELECTOR = 'input selector textarea';
  LocalRecoverier = (function(){
    LocalRecoverier.displayName = 'LocalRecoverier';
    var prototype = LocalRecoverier.prototype, constructor = LocalRecoverier;
    function LocalRecoverier(form){
      this.form = $(form);
      this.recoverFromLocalStorage();
      this.bindEventToForm();
    }
    prototype.recoverFromLocalStorage = function(){};
    prototype.bindEventToForm = function(){};
    return LocalRecoverier;
  }());
  localRecoverierManager = function(){
    return {
      create: function(selector){
        return new LocalRecoverier(selector);
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('local-recoverier-manager', [], localRecoverierManager);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.localRecoverierManager = localRecoverierManager();
  }
}).call(this);
