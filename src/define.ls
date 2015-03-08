modules = {}
modules-caches = {}

deps-src = {}
deps-trg = {}

@_debug = {modules, modules-caches, deps-src, deps-trg}

fn-body-regex = /^function\s*\(.*?\)\s*\{([\s\S]*)\}$/
require-list-regex = /require\(['"](.*?)['"]\)/g
require-regex = /require\(['"](.*?)['"]\)/

@define = (module-name, fn)!->
  check-module-name(module-name)
  load-module module-name, fn
define.cmd = {}

@require = (name)->
  modules[name]

check-module-name = (module-name)!->
  # console.log module-name
  throw new Error "Modules #{module-name} is already exists." if modules-caches[module-name] or modules[module-name]

get-dependency-list = (fn)->
  fn-body = fn.toString!.match fn-body-regex .[1]
  dependency-list = (fn-body.match require-list-regex or []).map ->
    it.match require-regex .[1]

set-dependency = (module-name, dependency-list)!->
  deps = deps-src[module-name] = {}
  for dep in dependency-list
    deps[dep] = !!modules[dep]
    deps-trg[][dep].push(module-name) if not deps[dep]

check-dependency = (module-name)->
  if Object.keys deps-src[module-name] .length is 0 then return true
  for dep, is-dep-load of deps-src[module-name]
    if not is-dep-load then return false
  true

load-module = (module-name, fn)!->
  if modules[module-name] then return
  if typeof fn is 'function'
    modules-caches[module-name] = fn
    dependency-list = get-dependency-list(fn)
    set-dependency module-name, dependency-list
  if check-dependency(module-name)
    module = exports: {}
    return-obj = modules-caches[module-name](require, module.exports, module)
    modules[module-name] = if return-obj? then return-obj else module.exports
    load-depended-module(module-name)
    delete modules-caches[module-name]

load-depended-module = (module-name)!->
  for own index, dep of deps-trg[][module-name]
    deps-src[dep][module-name] = true
    load-module(dep)

