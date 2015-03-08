(function(){
  var modules, modulesCaches, depsSrc, depsTrg, fnBodyRegex, requireListRegex, requireRegex, checkModuleName, getDependencyList, setDependency, checkDependency, loadModule, loadDependedModule;
  modules = {};
  modulesCaches = {};
  depsSrc = {};
  depsTrg = {};
  this._debug = {
    modules: modules,
    modulesCaches: modulesCaches,
    depsSrc: depsSrc,
    depsTrg: depsTrg
  };
  fnBodyRegex = /^function\s*\(.*?\)\s*\{([\s\S]*)\}$/;
  requireListRegex = /require\(['"](.*?)['"]\)/g;
  requireRegex = /require\(['"](.*?)['"]\)/;
  this.define = function(moduleName, fn){
    checkModuleName(moduleName);
    loadModule(moduleName, fn);
  };
  define.cmd = {};
  this.require = function(name){
    return modules[name];
  };
  checkModuleName = function(moduleName){
    if (modulesCaches[moduleName] || modules[moduleName]) {
      throw new Error("Modules " + moduleName + " is already exists.");
    }
  };
  getDependencyList = function(fn){
    var fnBody, dependencyList;
    fnBody = fn.toString().match(fnBodyRegex)[1];
    return dependencyList = (fnBody.match(requireListRegex) || []).map(function(it){
      return it.match(requireRegex)[1];
    });
  };
  setDependency = function(moduleName, dependencyList){
    var deps, i$, len$, dep;
    deps = depsSrc[moduleName] = {};
    for (i$ = 0, len$ = dependencyList.length; i$ < len$; ++i$) {
      dep = dependencyList[i$];
      deps[dep] = !!modules[dep];
      if (!deps[dep]) {
        (depsTrg[dep] || (depsTrg[dep] = [])).push(moduleName);
      }
    }
  };
  checkDependency = function(moduleName){
    var dep, ref$, isDepLoad;
    if (Object.keys(depsSrc[moduleName]).length === 0) {
      return true;
    }
    for (dep in ref$ = depsSrc[moduleName]) {
      isDepLoad = ref$[dep];
      if (!isDepLoad) {
        return false;
      }
    }
    return true;
  };
  loadModule = function(moduleName, fn){
    var dependencyList, module, returnObj;
    if (modules[moduleName]) {
      return;
    }
    if (typeof fn === 'function') {
      modulesCaches[moduleName] = fn;
      dependencyList = getDependencyList(fn);
      setDependency(moduleName, dependencyList);
    }
    if (checkDependency(moduleName)) {
      module = {
        exports: {}
      };
      returnObj = modulesCaches[moduleName](require, module.exports, module);
      modules[moduleName] = returnObj != null
        ? returnObj
        : module.exports;
      loadDependedModule(moduleName);
      delete modulesCaches[moduleName];
    }
  };
  loadDependedModule = function(moduleName){
    var index, ref$, dep, own$ = {}.hasOwnProperty;
    for (index in ref$ = depsTrg[moduleName] || (depsTrg[moduleName] = [])) if (own$.call(ref$, index)) {
      dep = ref$[index];
      depsSrc[dep][moduleName] = true;
      loadModule(dep);
    }
  };
}).call(this);
