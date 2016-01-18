#!/usr/bin/env node
'use strict'
var fs = require('fs')
var repl = require('repl').start({})

var _modules = {} // { module: _var, ... }
// I store all the rerequired modules here.
// the key's value is the global variable associated with the module

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
    console.log(`[rerequire]: ${module_name} is already rerequired at variable '${_var}'`)
  }

  if (!_var) {
    let fsTimeout

    _modules[module] = var_name

    fs.watch(module, (event, filename) => {
    // << This could be a source of bugs >>
    // fs.watch on linux uses inotify -- which will send two change events on each file save
    // I believe one of these is MODIFY and one is CLOSE_WRITE
    // I can't tell the difference from within Node, so I'm putting a timeout 1 sec
    // so that the second change call will not do anything -- "if (!fsTimeout)"
      if (!fsTimeout && event === 'change') {
        delete repl.context.require.cache[module]
        try {
          repl.context.global[var_name] = require(module)
        } finally {
          // if there is a syntax error from require(module)
          // I still want to make sure that the fsTimeout gets set.
          // this finally block ensures the second fs.watch call always gets blocked
          // regardless of a syntax error or not.
          fsTimeout = setTimeout(() => fsTimeout = null, 1000)
        }
      }
    })

    repl.context.global[var_name] = require(module)
  }
}
