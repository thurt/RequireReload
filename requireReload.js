var fs = require('fs')
var reload_modules = []

function requireReload (module, global_name) {
   var resolved_module = require.resolve(module)
   var found_index = null
   var module_exists = reload_modules.some((reload_set, i) => {
      if (reload_set[0] === resolved_module) {
         found_index = i
         return true
      }
   })
   if (module_exists) {
      console.log(`[requireReload]: module ${reload_modules[found_index][0]} is already being reloaded -- global vars affected ${reload_modules[found_index][1]}`)
   }
   if (!module_exists) {
      reload_modules.push([resolved_module, global_name])
      fs.watch(resolved_module, { persistent: true, recursive: false }, (event, filename) => {
         if (event === 'change') {
            var resolved_module = require.resolve(__dirname + '/' + filename)
            delete require.cache[resolved_module]
            global[global_name] = require(resolved_module)
         }
      })
      global[global_name] = require(resolved_module)
   }
}


module.exports = requireReload