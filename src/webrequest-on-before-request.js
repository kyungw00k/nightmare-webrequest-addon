var Nightmare = require('nightmare'),
  fn = require('./webrequest-callback-factory')('onBeforeRequest')

Nightmare.action('onBeforeRequest',
  function (name, options, parent, win, renderer, done) {
    parent.on('onBeforeRequest', function () {
      var args = []
      !!arguments[0] && args.push(arguments[0])
      !!arguments[1] && args.push(arguments[1])

      var arg1 = args.length ? args.pop() : null
      var arg2 = args.length ? args.pop() : null

      if (typeof arg1 === 'object' && arg2) {
        win.webContents.session.webRequest.onBeforeRequest(arg1, function (details, cb) {
          parent.emit('onBeforeRequest', details)
          var fn = new Function('with(this){return ' + arg2 + '}').call({})
          fn(details, cb)
        })
      } else if (!!arg1) {
        win.webContents.session.webRequest.onBeforeRequest(function (details, cb) {
          parent.emit('onBeforeRequest', details)
          var fn = new Function('with(this){return ' + arg1 + '}').call({})
          fn(details, cb)
        })
      } else {
        win.webContents.session.webRequest.onBeforeRequest(null)
      }

      parent.emit('onBeforeRequest')
    })
    done()
    return this
  }, fn)
