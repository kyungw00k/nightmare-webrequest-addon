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

describe('onCompleted', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-completed')
    server = require('./server').listen(7500, done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onCompleted.should.be.ok
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .onCompleted({urls: ['http://*/*', 'https://*/*']})

      .on('onCompleted', function (details) {
        if (details && !result) {
          result = details
        }
      })

      .goto(fixture('webrequest'))

    result.should.be.ok
    ;(typeof result.fromCache).should.equal('boolean')
    result.statusLine.should.equal('HTTP/1.1 200 OK')
    result.statusCode.should.equal(200)
  })

  afterEach(function * () {
    nightmare.child.removeAllListeners('onCompleted')
    nightmare.onCompleted(null)

    yield nightmare.end()
  })

  after(function (done) {
    delete nightmare.onCompleted

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
