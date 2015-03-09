(function(){
  var AllDoneWaiter, util, root, ref$;
  String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  String.prototype.camelize = function(isFirstUppercase){
    isFirstUppercase == null && (isFirstUppercase = false);
    return this.split('-').map(function(token, index){
      if (index === 0 && !isFirstUppercase) {
        return token;
      } else {
        return token.capitalize();
      }
    }).join('');
  };
  String.prototype.contains = function(substr){
    return this.indexOf(substr) > -1;
  };
  Array.prototype.anyContains = function(str){
    var i$, len$, e;
    for (i$ = 0, len$ = this.length; i$ < len$; ++i$) {
      e = this[i$];
      if (typeof e === 'string' && e.contains(str)) {
        return true;
      }
    }
    return false;
  };
  Array.prototype.next = function(){
    var index;
    index = 0;
    return function(){
      return this[index++ % this.length];
    };
  }();
  Array.prototype.findIndex = function(obj){
    var i$, len$, i, element;
    for (i$ = 0, len$ = this.length; i$ < len$; ++i$) {
      i = i$;
      element = this[i$];
      if (obj === element) {
        return i;
      }
    }
    return null;
  };
  Function.prototype.decorate = function(arg$){
    var before, after, isPassingArguments;
    before = arg$.before, after = arg$.after, isPassingArguments = arg$.isPassingArguments;
    return (function(b, a, self){
      if (isPassingArguments) {
        return function(){
          var bR, sR, aR;
          bR = typeof b === 'function' ? b.apply(this, arguments) : void 8;
          sR = bR
            ? self(bR)
            : self.apply(this, arguments);
          return aR = (typeof a === 'function' ? a(sR) : void 8) || sR;
        };
      } else {
        return function(){
          if (typeof b === 'function') {
            b.apply(this, arguments);
          }
          self.apply(this, arguments);
          return typeof a === 'function' ? a.apply(this, arguments) : void 8;
        };
      }
    }.call(this, before, after, this));
  };
  Function.once = function(fn){
    var isCalled;
    isCalled = false;
    return function(){
      if (!isCalled) {
        return isCalled = true, fn.apply(this, arguments);
      }
    };
  };
  /*
    @Description: 异步处理
    @Author: Wangqing
    @Date: 2014/10/4
    @Version: 0.0.2
   */
  AllDoneWaiter = (function(){
    AllDoneWaiter.displayName = 'AllDoneWaiter';
    var prototype = AllDoneWaiter.prototype, constructor = AllDoneWaiter;
    AllDoneWaiter.allComplete = function(collection, fnName, done){
      var waiter, waiters, key, element;
      if (Array.isArray(collection) && collection.length === 0) {
        return done();
      }
      waiter = new this(done);
      waiters = {};
      for (key in collection) {
        element = collection[key];
        if (collection.hasOwnProperty(key)) {
          waiters[key] = waiter.addWaitingFunction();
        }
      }
      for (key in collection) {
        element = collection[key];
        if (typeof element[fnName] === 'function') {
          element[fnName](waiters[key]);
        }
      }
    };
    AllDoneWaiter.getLogFuntion = function(element, done){
      return function(){
        console.log("******* syncer initialized, state: " + element.state.name + ", via channel: " + element.channel.name);
        return done();
      };
    };
    AllDoneWaiter.allDoneOneByOne = function(collection, fnName, done){
      var fn, i$, ref$, len$, element;
      fn = done;
      for (i$ = 0, len$ = (ref$ = collection.reverse()).length; i$ < len$; ++i$) {
        element = ref$[i$];
        (fn$.call(this, fn, element));
      }
      fn();
      function fn$(f, element){
        fn = function(){
          if (typeof element[fnName] === 'function') {
            element[fnName](f);
          }
        };
      }
    };
    function AllDoneWaiter(done){
      this.done = done;
      this.count = 0;
    }
    prototype.addWaitingFunction = function(fn){
      var newFn, this$ = this;
      fn || (fn = function(){
        return 1 + 1;
      });
      this.count += 1;
      newFn = function(){
        fn.apply(null, arguments);
        this$.count -= 1;
        this$.check();
      };
      return newFn;
    };
    prototype.check = function(){
      if (this.count === 0) {
        this.done();
      }
    };
    return AllDoneWaiter;
  }());
  util = function(){
    return {
      isNumber: function(numberOrStr){
        return !isNaN(numberOrStr);
      },
      AllDoneWaiter: AllDoneWaiter,
      getRandomKey: function(){
        return '' + Date.now() + Math.random();
      },
      getKeyOfValue: function(obj, value){
        var i$, ref$, len$, key;
        for (i$ = 0, len$ = (ref$ = Object.keys(obj)).length; i$ < len$; ++i$) {
          key = ref$[i$];
          if (obj[key] === value) {
            return key;
          }
        }
        return null;
      }
    };
  };
  if (typeof define != 'undefined' && define !== null) {
    define('util', [], util);
  } else {
    root = (ref$ = typeof module != 'undefined' && module !== null ? module.exports : void 8) != null ? ref$ : this;
    root.util = util();
  }
}).call(this);
