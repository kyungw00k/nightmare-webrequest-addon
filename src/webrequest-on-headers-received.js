var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onHeadersReceived')

Nightmare.action('onHeadersReceived',
  function (name, options, parent, win, renderer, done) {
    parent.on('onHeadersReceived', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])
      !!arguments[1] && args.push(arguments[1])

      var arg1 = args.length ? args.pop() : null
      var arg2 = args.length ? args.pop() : { cancel: false }

      if (typeof arg1 === 'object' && arg2) {
        win.webContents.session.webRequest.onHeadersReceived(arg1, function (details, callback) {
          parent.emit('onHeadersReceived', details)
          var fn = new Function('with(this){return ' + arg2 + '}').call({})
          return fn(details, callback)
        })
      } else if (arg1) {
        win.webContents.session.webRequest.onHeadersReceived(function (details, callback) {
          parent.emit('onHeadersReceived', details)
          var fn = new Function('with(this){return ' + arg1 + '}').call({})
          return fn(details, callback)
        })
      } else {
        win.webContents.session.webRequest.onHeadersReceived(null)
      }

      parent.emit('onHeadersReceived')
    })
    done()
    return this
  }, fn)
