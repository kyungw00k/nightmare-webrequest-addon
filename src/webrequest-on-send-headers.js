var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onSendHeaders')

Nightmare.action('onSendHeaders',
  function (name, options, parent, win, renderer, done) {
    parent.on('onSendHeaders', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])

      var arg1 = args.length ? args.pop() : null

      if (typeof arg1 === 'object') {
        win.webContents.session.webRequest.onSendHeaders(arg1, function (details) {
          parent.emit('onSendHeaders', details)
        })
      } else {
        win.webContents.session.webRequest.onSendHeaders(null)
      }

      parent.emit('onSendHeaders')
    })
    done()
    return this
  }, fn)
