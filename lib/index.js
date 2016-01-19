'use strict'
var fs = require('fs')

//module.paths.concat(global.module.paths)
// i'm not sure why .concat doesn't work here

global.module.paths.forEach(path => {
    module.paths.unshift(path)
  })
  // this alternative works,
  // but may not be efficient if there are overlapping paths b/w global and module

var _modules = {} // { module: _var, ... }
// I store all the rerequired modules here.
// the key's value is the global variable associated with the module

global.rerequire = (module_name, var_name) => {
  let module = require.resolve(module_name)
  let _var = _modules[module]

  if (_var) {
    console.log(`[rerequire]: attendez--I already have ${module_name} at variable ${_var}`)
  }

  if (!_var) {
    let fsTimeout

    _modules[module] = var_name

    global[var_name] = require(module)

    fs.watch(module, (event, filename) => {
      // << This could be a source of bugs >>
      // fs.watch on linux uses inotify -- which will send two change events on each file save
      // I believe one of these is MODIFY and one is CLOSE_WRITE
      // I can't tell the difference from within Node, so I'm putting a timeout 1 sec
      // so that the second change call will not do anything -- "if (!fsTimeout)"
      if (!fsTimeout && event === 'change') {
        console.log(`deleting:  `, global.require.cache[module])
        delete global.require.cache[module]
        try {
          global[var_name] = require(module)
        }
        finally {
          // if there is a syntax error from require(module)
          // I still want to make sure that the fsTimeout gets set.
          // this finally block ensures the second fs.watch call always gets blocked
          // regardless of a syntax error or not.
          fsTimeout = setTimeout(() => fsTimeout = null, 1000)
        }
      }
    })

    console.log(`[rerequire]: bonjour--I've been re-requiring since 2016`)
  }
}
