'use strict'
var fs = require('fs')
var repl = require('repl').start({})
var _modules = {} // { module: _var, ... }

repl.context.rerequire = (module_name, var_name) => {
  let module = require.resolve(module_name)
  let _var = null

  for (let _module in _modules) {
    if (_module === module) {
      _var = _modules[_module]
      break
    }
  }

  if (_var) {
    console.log(`[rerequire]: ${module_name} is already requirer at variable '${_var}'`)
  }

  if (!_var) {
    let fsTimeout

    _modules[module] = var_name

    fs.watch(module, (event, filename) => {
      if (!fsTimeout && event === 'change') {
        delete repl.context.require.cache[module]
        repl.context.global[var_name] = require(module)
      }

      fsTimeout = setTimeout(() => fsTimeout = null, 1000)
    })

    repl.context.global[var_name] = require(module)
  }
}
