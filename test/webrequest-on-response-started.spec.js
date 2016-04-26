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

describe('onResponseStarted', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-response-started')
    server = require('./server').listen(7500, 'localhost', done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onResponseStarted.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .onResponseStarted({urls: ['http://*/*', 'https://*/*']})

      .on('onResponseStarted', function (details) {
        if (details && !result) {
          result = details
        }
      })

      .goto(fixture('headers'))

    result.should.be.ok
    ;(typeof result.fromCache).should.equal('boolean')
    result.statusLine.should.equal('HTTP/1.1 200 OK')
    result.statusCode.should.equal(200)
    result.responseHeaders['Cache-Control'][0].should.equal('no-cache')
    result.responseHeaders['Expires'][0].should.equal('-1')
    result.responseHeaders['Pragma'][0].should.equal('no-cache')
  })

  afterEach(function * () {
    nightmare.onResponseStarted(null)
    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onResponseStarted
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
