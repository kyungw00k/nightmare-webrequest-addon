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

describe('onErrorOccurred', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-error-occurred')
    require('../src/webrequest-on-before-request')
    server = require('./server').listen(7500, done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onErrorOccurred.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onErrorOccurred({urls: ['http://*/*', 'https://*/*']})

      .on('onErrorOccurred', function (details) {
        if (details && !result) {
          result = details
        }
      })

      .onBeforeRequest(function (detail, callback) {
        callback({
          cancel: true
        })
      })

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/webrequest/there_is_no_such_resource',
          type: 'GET'
        })
      })
      .wait(500)

    result.should.be.ok
    result.error.should.equal('net::ERR_BLOCKED_BY_CLIENT')
  })

  afterEach(function * () {
    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onErrorOccurred
    delete nightmare.onBeforeRequest

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
