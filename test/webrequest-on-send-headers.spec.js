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

describe('onSendHeaders', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-send-headers')
    server = require('./server').listen(7500, 'localhost', done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onSendHeaders.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onSendHeaders({urls: ['http://*/*', 'https://*/*']})

      .on('onSendHeaders', function (details) {
        if (details && !result) {
          result = details
        }
      })
      .wait(1000)

      .evaluate(function () {
        $.ajax({
          headers: {
            'My-First-Header': 'first value',
            'My-Second-Header': 'second value'
          },
          url: 'http://localhost:7500/webrequest/',
          type: 'GET'
        })
      })

    result.should.be.ok
    result.requestHeaders.should.be.ok
    result.requestHeaders['My-First-Header'].should.equal('first value')
    result.requestHeaders['My-Second-Header'].should.equal('second value')
  })

  afterEach(function * () {
    nightmare.child.removeAllListeners('onSendHeaders')
    nightmare.onSendHeaders(null)
    yield nightmare.end()
  })

  after(function (done) {
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
