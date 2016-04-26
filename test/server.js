/**
 * Module dependencies.
 */

var express = require('express')
var path = require('path')
var serve = require('serve-static')

/**
 * Locals.
 */

var app = module.exports = express()

app.use(serve(path.resolve(__dirname, 'fixtures')))

/**
 * Echo HTTP Headers for testing assertions.
 */

app.get('/headers', function (req, res) {
  res.header('Cache-Control', 'no-cache')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  res.send(req.headers)
})

/**
 * Start if not required.
 */

if (!module.parent)
  app.listen(7500)
