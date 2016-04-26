var Nightmare = require('nightmare')

module.exports = function (event) {
  /**
   * The webRequest API Callback Function
   *
   * @param {Object} filter (optional)
   * @param {Function} listener
   */
  var fn = function callbackFunction () {
    var args = [].slice.call(arguments)
    var newArgs = []

    if (typeof args[0] === 'object') {
      newArgs.push(args.shift())
    } else {
      newArgs.push(String(args.shift()))
    }

    if (args.length > 1) {
      newArgs.push(String(args.shift()))
    }

    var done = args.shift()

    this.child.once(event, done)
    this.child.emit.apply(this, [event].concat(newArgs))
  }

  return fn
}
