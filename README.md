# nightmare-webrequest-addon 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![npm version](https://badge.fury.io/js/nightmare-webrequest-addon.svg)](http://badge.fury.io/js/nightmare-webrequest-addon) [![travis-ci](https://travis-ci.org/kyungw00k/nightmare-webrequest-addon.svg)](https://travis-ci.org/kyungw00k/nightmare-webrequest-addon/)
> The `webRequest` API set allows to intercept and modify contents of a request at various stages of its lifetime.
> (from https://github.com/electron/electron/blob/master/docs/api/session.md#seswebrequest)

This is the wrapper of Electron API `session.webRequest`.

## Install
```
npm install --save nightmare-webrequest-addon
```

## Usage

### `nightmare.onBeforeRequest([filter, ]listener)`
* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details, callback)` when a request
is about to occur.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `uploadData` Array (optional)
* `callback` Function

The `uploadData` is an array of `data` objects:

* `data` Object
  * `bytes` Buffer - Content being sent.
  * `file` String - Path of file being uploaded.

The `callback` has to be called with an `response` object:

* `response` Object
  * `cancel` Boolean (optional)
  * `redirectURL` String (optional) - The original request is prevented from
    being sent or completed, and is instead redirected to the given URL.

**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onBeforeRequest', callback)`
 
The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `uploadData` Array (optional)
  
See the [example](test/webrequest-on-before-request.spec.js).

### `nightmare.onBeforeSendHeaders([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details, callback)` before sending
an HTTP request, once the request headers are available. This may occur after a
TCP connection is made to the server, but before any http data is sent.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `requestHeaders` Object
* `callback` Function

The `callback` has to be called with an `response` object:

* `response` Object
  * `cancel` Boolean (optional)
  * `requestHeaders` Object (optional) - When provided, request will be made
    with these headers.

**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onBeforeSendHeaders', callback)`
 
The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `requestHeaders` Object

See the [example](test/webrequest-on-before-send-headers.spec.js).

### `nightmare.onSendHeaders([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details)` just before a request is
going to be sent to the server, modifications of previous `onBeforeSendHeaders`
response are visible by the time this listener is fired.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `requestHeaders` Object
  
**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onBeforeSendHeaders', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `requestHeaders` Object
  
See the [example](test/webrequest-on-send-headers.spec.js).

### `nightmare.onHeadersReceived([filter,]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details, callback)` when HTTP
response headers of a request have been received.

* `details` Object
  * `id` String
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `statusLine` String
  * `statusCode` Integer
  * `responseHeaders` Object
* `callback` Function

The `callback` has to be called with an `response` object:

* `response` Object
  * `cancel` Boolean
  * `responseHeaders` Object (optional) - When provided, the server is assumed
    to have responded with these headers.
  * `statusLine` String (optional) - Should be provided when overriding
    `responseHeaders` to change header status otherwise original response
    header's status will be used.
    
**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onHeadersReceived', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` String
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `statusLine` String
  * `statusCode` Integer
  * `responseHeaders` Object

See the [example](test/webrequest-on-headers-received.spec.js).

### `nightmare.onResponseStarted([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details)` when first byte of the
response body is received. For HTTP requests, this means that the status line
and response headers are available.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `responseHeaders` Object
  * `fromCache` Boolean - Indicates whether the response was fetched from disk
    cache.
  * `statusCode` Integer
  * `statusLine` String

**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onResponseStarted', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `responseHeaders` Object
  * `fromCache` Boolean - Indicates whether the response was fetched from disk
    cache.
  * `statusCode` Integer
  * `statusLine` String

See the [example](test/webrequest-on-response-started.spec.js).

### `nightmare.onBeforeRedirect([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details)` when a server initiated
redirect is about to occur.

* `details` Object
  * `id` String
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `redirectURL` String
  * `statusCode` Integer
  * `ip` String (optional) - The server IP address that the request was
    actually sent to.
  * `fromCache` Boolean
  * `responseHeaders` Object

**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onBeforeRedirect', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` String
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `redirectURL` String
  * `statusCode` Integer
  * `ip` String (optional) - The server IP address that the request was
    actually sent to.
  * `fromCache` Boolean
  * `responseHeaders` Object

See the [example](test/webrequest-on-before-redirect.spec.js).

### `nightmare.onCompleted([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details)` when a request is
completed.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `responseHeaders` Object
  * `fromCache` Boolean
  * `statusCode` Integer
  * `statusLine` String
  
**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onCompleted', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `responseHeaders` Object
  * `fromCache` Boolean
  * `statusCode` Integer
  * `statusLine` String

See the [example](test/webrequest-on-completed.spec.js).

### `nightmare.onErrorOccurred([filter, ]listener)`

* `filter` Object
* `listener` Function

The `listener` will be called with `listener(details)` when an error occurs.

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `fromCache` Boolean
  * `error` String - The error description.
  
**Note: `listener` is Electron-side context, cannot access any variable/function outside of `listener`**

If you want to use `details` Object in the nodeJS-side, use `nightmare.on('onErrorOccurred', callback)`

The `callback` has to be called with an `details` object:

* `details` Object
  * `id` Integer
  * `url` String
  * `method` String
  * `resourceType` String
  * `timestamp` Double
  * `fromCache` Boolean
  * `error` String - The error description.

See the [example](test/webrequest-on-error-occurred.spec.js).

## Thanks to [@rosshinkley](https://github.com/rosshinkley/)
This module is heavily inspired by [nightmare-load-filter](https://github.com/rosshinkley/nightmare-load-filter)

## License
MIT
