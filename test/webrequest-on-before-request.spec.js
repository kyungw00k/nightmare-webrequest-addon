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

describe('onBeforeRequest', function () {
  var nightmare

  before(function (done) {
    require('../src/webrequest-on-before-request')

    server = require('./server').listen(7500, 'localhost', done)
  })

  beforeEach(function () {
    nightmare = Nightmare()
  })

  it('should be accessable', function * () {
    nightmare.onBeforeRequest.should.be.ok
  })

  it('can cancel the request', function * () {
    var result

    yield nightmare

      .on('onBeforeRequest', function (details) {
        if (details) {
          result = details
        }
      })

      .goto(fixture('webrequest'))

      .onBeforeRequest(function (details, callback) {
        callback({cancel: true})
      })

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/filter/test',
          type: 'GET'
        })
      })
      .wait(500)

    result.should.be.ok
    result.method.should.equal('GET')
  })

  it('can filter URLs', function * () {
    var result

    var filter = {
      urls: [base + 'filter/*']
    }

    yield nightmare
      .goto(fixture('webrequest'))

      .onBeforeRequest(filter, function (details, callback) {
        callback({})
      })

      .on('onBeforeRequest', function (details) {
        if (details) {
          result = details
        }
      })

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/filter/test',
          type: 'POST',
          data: {
            name: 'post test',
            type: 'string'
          }
        })
      })
      .wait(500)

    result.should.be.ok
    result.url.should.equal(base + 'filter/test')
    result.method.should.equal(result.method, 'GET')
    result.resourceType.should.equal(result.resourceType, 'xhr')
  })

  it('receives details object', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))

      .onBeforeRequest(function (details, callback) {
        callback({cancel: true})
      })

      .on('onBeforeRequest', function (details) {
        if (details) {
          result = details
        }
      })

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/webrequest',
          type: 'GET'
        })
      })
      .wait(500)

    result.should.be.ok
    ;(typeof result.id).should.equal('number')
    ;(typeof result.timestamp).should.equal('number')
    result.url.should.equal(result.url, 'http://localhost:7500/webrequest')
    result.method.should.equal(result.method, 'GET')
    result.resourceType.should.equal(result.resourceType, 'xhr')
    ;(!result.uploadData).should.be.true
  })

  it('receives post data in details object', function * () {
    var result

    yield nightmare
      .goto(fixture('webrequest'))
      .onBeforeRequest(function (details, callback) {
        callback({cancel: false})
      })
      .on('onBeforeRequest', function (details) {
        if (details) {
          result = details
        }
      })
      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/',
          type: 'POST',
          data: {
            name: 'post test',
            type: 'string'
          }
        })
      })
      .wait(500)

    result.should.be.ok
    result.url.should.equal(result.url, 'http://localhost:7500/')
    result.method.should.equal(result.method, 'POST')
    result.resourceType.should.equal(result.resourceType, 'xhr')

    JSON.stringify(qs.parse(new Buffer(result.uploadData[0].bytes.data).toString())).should.equals(JSON.stringify({ name: 'post test',
      type: 'string'
    }))
  })

  it('can redirect the request', function * () {
    var result

    yield nightmare
      .onBeforeRequest(function (details, callback) {
        var defaultURL = 'http://localhost:7500/'
        if (details.url === defaultURL) {
          callback({
            redirectURL: defaultURL + 'redirect'
          })
        } else {
          callback({})
        }
      })

      .on('onBeforeRequest', function (details) {
        if (details) {
          result = details
        }
      })

      .goto(fixture('webrequest'))

      .evaluate(function () {
        $.ajax({
          url: 'http://localhost:7500/'
        })
      })
      .wait(500)

    result.should.be.ok
    result.url.should.equal(result.url, 'http://localhost:7500/redirect')
    result.resourceType.should.equal(result.resourceType, 'xhr')
  })

  afterEach(function * () {
    nightmare.onBeforeRequest(null)

    yield nightmare.end()
  })

  after(function (done) {
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
