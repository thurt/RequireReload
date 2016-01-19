#!/usr/bin/env node
'use strict'

require('repl').start({ useGlobal: true })

require('../lib/index.js')
// you could also require lib/index.js in your own repl
