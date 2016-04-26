var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onBeforeRedirect')

Nightmare.action('onBeforeRedirect',
  function (name, options, parent, win, renderer, done) {
    parent.on('onBeforeRedirect', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])

      var arg1 = args.length ? args.pop() : null

      if (typeof arg1 === 'object') {
        win.webContents.session.webRequest.onBeforeRedirect(arg1, function (details) {
          parent.emit('onBeforeRedirect', details)
        })
      } else {
        win.webContents.session.webRequest.onBeforeRedirect(null)
      }

      parent.emit('onBeforeRedirect')
    })
    done()
    return this
  }, fn)
