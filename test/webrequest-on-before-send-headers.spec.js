/**
 * Module dependencies.
 */

require('mocha-generators').install()

var Nightmare = require('nightmare')
var should = require('chai').should()
var url = require('url')
var path = require('path')
var qs = require('querystring')
var server

/**
 * Temporary directory
 */

var tmp_dir = path.join(__dirname, 'tmp')

/**
 * Get rid of a warning.
 */

process.setMaxListeners(0)

/**
 * Locals.
 */

var base = 'http://localhost:7500/'

describe('onBeforeSendHeaders', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-before-send-headers')
    require('../src/webrequest-on-send-headers')

    server = require('./server').listen(7500, done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onBeforeSendHeaders.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onBeforeSendHeaders(function (details, callback) {
        callback({cancel: true})
      })

      .on('onBeforeSendHeaders', function (details) {
        if (details) {
          result = details
        }
      })

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/webrequest/',
          type: 'GET'
        })
      })

      .wait(500)

    result.should.be.ok
    ;(typeof result.requestHeaders).should.equal('object')
  })

  it('can change the request headers', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onBeforeSendHeaders(function (details, callback) {
        callback({cancel: false, requestHeaders: {Accept: '*/*;test/header'} })
      })

      .on('onSendHeaders', function (details) {
        if (details) {
          result = details
        }
      })

      .onSendHeaders({urls: ['http://*/*', 'https://*/*']})

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/webrequest/',
          type: 'GET'
        })
      })
      .wait(500)

    result.should.be.ok
    ;(typeof result.requestHeaders).should.equal('object')
    ;(JSON.stringify(result.requestHeaders)).should.equal(JSON.stringify({'Accept': '*/*;test/header'}))
  })

  it('resets the whole headers', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onBeforeSendHeaders(function (details, callback) {
        var requestHeaders = {
          Test: 'header'
        }

        callback({cancel: false, requestHeaders: requestHeaders})
      })

      .on('onSendHeaders', function (details) {
        if (details) {
          result = details
        }
      })

      .onSendHeaders({})

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/webrequest/',
          type: 'GET'
        })
      })
      .wait(500)

    result.should.be.ok
    ;(typeof result.requestHeaders).should.equal('object')
    ;(JSON.stringify(result.requestHeaders)).should.equal(JSON.stringify({Test: 'header'}))
  })

  afterEach(function * () {
    nightmare.child.removeAllListeners('onBeforeSendHeaders')
    nightmare.onBeforeSendHeaders(null)

    nightmare.child.removeAllListeners('onSendHeaders')
    nightmare.onSendHeaders(null)

    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onBeforeSendHeaders
    delete nightmare.onSendHeaders

    server.close(done)
  })
})

/**
 * Generate a URL to a specific fixture.
 *
 * @param {String} path
 * @returns {String}
 */

function fixture (path) {
  return url.resolve(base, path) + '/'
}
