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

describe('onHeadersReceived', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-headers-received')
    server = require('./server').listen(7500, done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onHeadersReceived.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .onHeadersReceived(function (details, callback) {
        callback({})
      })

      .on('did-get-response-details', function (event,
        status,
        newURL,
        originalURL,
        httpResponseCode,
        requestMethod,
        referrer,
        headers) {
        if (headers && !result) {
          result = headers
        }
      })

      .goto(fixture('headers'))

      .wait(500)

    result.should.be.ok
    result['x-powered-by'][0].should.equal('Express')
  })

  it('can change the response header', function * () {
    var result

    yield nightmare
      .onHeadersReceived(function (details, callback) {
        callback({responseHeaders: {'X-Powered-By': ['TEST']}})
      })
      .on('did-get-response-details', function (event,
        status,
        newURL,
        originalURL,
        httpResponseCode,
        requestMethod,
        referrer,
        headers) {
        if (headers && !result) {
          result = headers
        }
      })
      .goto(fixture('headers'))

    result.should.be.ok
    result['x-powered-by'][0].should.equal('TEST')
  })

  afterEach(function * () {
    nightmare.onHeadersReceived(null)
    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onHeadersReceived
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
