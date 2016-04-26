var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onBeforeSendHeaders')

Nightmare.action('onBeforeSendHeaders',
  function (name, options, parent, win, renderer, done) {
    parent.on('onBeforeSendHeaders', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])
      !!arguments[1] && args.push(arguments[1])

      var arg1 = args.length ? args.pop() : null
      var arg2 = args.length ? args.pop() : null

      if (typeof arg1 === 'object' && arg2) {
        win.webContents.session.webRequest.onBeforeSendHeaders(arg1, function (details, cb) {
          parent.emit('onBeforeSendHeaders', details)
          var fn = new Function('with(this){return ' + arg2 + '}').call({})
          return fn(details, cb)
        })
      } else if (arg1) {
        win.webContents.session.webRequest.onBeforeSendHeaders(function (details, cb) {
          parent.emit('onBeforeSendHeaders', details)
          var fn = new Function('with(this){return ' + arg1 + '}').call({})
          return fn(details, cb)
        })
      } else {
        win.webContents.session.webRequest.onBeforeSendHeaders(null)
      }

      parent.emit('onBeforeSendHeaders')
    })
    done()
    return this
  }, fn)
