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

describe('onBeforeRedirect', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-before-request')
    require('../src/webrequest-on-before-redirect')
    server = require('./server').listen(7500, done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onBeforeRequest.should.be.ok
    nightmare.onBeforeRedirect.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare

      .onBeforeRequest(function (details, callback) {
        var defaultURL = 'http://localhost:7500/webrequest/'
        if (details.url === defaultURL) {
          callback({cancel: false, redirectURL: 'http://localhost:7500/redirect'})
        } else {
          callback({})
        }
      })

      .onBeforeRedirect({urls: ['http://*/*', 'https://*/*']})

      .on('onBeforeRedirect', function (details) {
        if (details && !result) {
          result = details
        }
      })

      .goto(fixture('webrequest'))

    result.should.be.ok
    ;(typeof result.fromCache).should.equal('boolean')
    result.statusLine.should.equal('HTTP/1.1 307 Internal Redirect')
    result.statusCode.should.equal(307)
  })

  afterEach(function * () {
    nightmare.child.removeAllListeners('onBeforeRequest')
    nightmare.onBeforeRequest(null)

    nightmare.child.removeAllListeners('onBeforeRedirect')
    nightmare.onBeforeRedirect(null)

    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onBeforeRequest
    delete nightmare.onBeforeRedirect

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
