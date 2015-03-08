(function(){
  var EventEmitter, root, ref$, slice$ = [].slice;
  EventEmitter = (function(){
    EventEmitter.displayName = 'EventEmitter';
    var prototype = EventEmitter.prototype, constructor = EventEmitter;
    function EventEmitter(){
      this._callback = {};
    }
    prototype.on = function(eventName, cb){
      var ref$;
      ((ref$ = this._callback)[eventName] || (ref$[eventName] = [])).push(cb);
      return this;
    };
    prototype.after = function(eventName, times, cb){
      var afterCb, this$ = this;
      if (times === 0) {
        cb();
      } else {
        afterCb = function(){
          if (--times === 0) {
            cb.apply(this$, arguments);
            this$.remove(eventName, afterCb);
          }
        };
        this.on(eventName, afterCb);
      }
      return this;
    };
    prototype.once = function(eventName, cb){
      var _cb, this$ = this;
      _cb = function(){
        cb.apply(this$, arguments);
        this$.remove(eventName, _cb);
      };
      return this.on(eventName, _cb);
    };
    prototype.remove = function(eventName, cb){
      var i$, ref$, len$, index, _cb;
      if (cb != null && this._callback[eventName] != null) {
        for (i$ = 0, len$ = (ref$ = this._callback[eventName]).length; i$ < len$; ++i$) {
          index = i$;
          _cb = ref$[i$];
          if (_cb === cb) {
            this._callback[eventName].splice(index, 1);
            break;
          }
        }
      } else {
        delete this._callback[eventName];
      }
      return this;
    };
    prototype.fire = function(eventName){
      var args, i$, ref$, len$, cb;
      args = slice$.call(arguments, 1);
      for (i$ = 0, len$ = (ref$ = this._callback[eventName] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        cb.apply(null, args);
      }
      return this;
    };
    prototype.emit = EventEmitter.prototype.fire;
    return EventEmitter;
  }());
  if ((typeof define != 'undefined' && define !== null ? define.cmd : void 8) != null) {
    define('event-emitter', function(){
      return EventEmitter;
    });
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.EventEmitter = EventEmitter;
  }
}).call(this);
