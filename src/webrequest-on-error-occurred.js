var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onErrorOccurred')

Nightmare.action('onErrorOccurred',
  function (name, options, parent, win, renderer, done) {
    parent.on('onErrorOccurred', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])

      var arg1 = args.length ? args.pop() : null

      if (typeof arg1 === 'object') {
        win.webContents.session.webRequest.onErrorOccurred(arg1, function (details) {
          parent.emit('onErrorOccurred', details)
        })
      } else {
        win.webContents.session.webRequest.onErrorOccurred(null)
      }

      parent.emit('onErrorOccurred')
    })
    done()
    return this
  }, fn)
