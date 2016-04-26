var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onCompleted')

Nightmare.action('onCompleted',
  function (name, options, parent, win, renderer, done) {
    parent.on('onCompleted', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])

      var arg1 = args.length ? args.pop() : null

      if (typeof arg1 === 'object') {
        win.webContents.session.webRequest.onCompleted(arg1, function (details) {
          parent.emit('onCompleted', details)
        })
      } else {
        win.webContents.session.webRequest.onCompleted(null)
      }

      parent.emit('onCompleted')
    })
    done()
    return this
  }, fn)
