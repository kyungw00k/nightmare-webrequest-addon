var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onResponseStarted')

Nightmare.action('onResponseStarted',
  function (name, options, parent, win, renderer, done) {
    parent.on('onResponseStarted', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])

      var arg1 = args.length ? args.pop() : null

      if (typeof arg1 === 'object') {
        win.webContents.session.webRequest.onResponseStarted(arg1, function (details) {
          parent.emit('onResponseStarted', details)
        })
      } else {
        win.webContents.session.webRequest.onResponseStarted(null)
      }

      parent.emit('onResponseStarted')
    })
    done()
    return this
  }, fn)
