'use strict';

var path = require('path')
var fs = require('fs')
var expect = require('expect.js')
var commander = require('commander')

var utilx = require('../index')


describe('utilx', function(){

  describe('split', function() {
    it('pass a string and return a split array', function() {
        var str = 'mac/chrome/10.0.0.1,firefox,sarafi/3.0'
        var rt = utilx.split(str)
        expect(rt.length).to.be(3)
        expect(rt[0]).to.be('mac/chrome/10.0.0.1')
    })

    it('pass any of other type and return an empty array', function() {
        expect(utilx.split().length).to.be(0)
        expect(utilx.split(false).length).to.be(0)
        expect(utilx.split([1,2,3]).length).to.be(3)
        expect(utilx.split({key:'value'}).length).to.be(0)
    })
  })

  it('camelcase', function() {
    expect(utilx.camelcase('totoro')).to.be('totoro')
    expect(utilx.camelcase('totoro-server')).to.be('totoroServer')
  })

  it('unCamelcase', function() {
    expect(utilx.unCamelcase('totoro')).to.be('totoro')
    expect(utilx.unCamelcase('totoroServer')).to.be('totoro-server')
    expect(utilx.unCamelcase('TotoroServer')).to.be('-totoro-server')
  })

  it('isExistedFile', function() {
    var existedFile = __filename
    var notExistedFile = path.join('path', 'to', 'not-existed-file.json')

    expect(utilx.isExistedFile(existedFile)).to.be(true)
    expect(utilx.isExistedFile(existedFile + '?querystring#hash')).to.be(true)
    expect(utilx.isExistedFile(existedFile + '?querystring')).to.be(true)
    expect(utilx.isExistedFile(existedFile + '#hash')).to.be(true)
    expect(utilx.isExistedFile(notExistedFile)).to.be(false)
  })

  it('isExistedDir', function() {
    var existedDir = __dirname
    var notExistedDir = path.join('path', 'to', 'not-existed-dir')
    expect(utilx.isExistedDir(existedDir)).to.be(true)
    expect(utilx.isExistedDir(existedDir + '?querystring#hash')).to.be(false)
    expect(utilx.isExistedDir(existedDir + '?querystring')).to.be(false)
    expect(utilx.isExistedDir(existedDir + '#hash')).to.be(false)
    expect(utilx.isExistedDir(notExistedDir)).to.be(false)
  })

  it('readFile', function(){
    var p = path.join(__dirname, 'read-file.txt')
    fs.writeFileSync(p, 'some text')
    expect(utilx.readFile(p)).to.be('some text')
    fs.unlinkSync(p)

    p = path.join(__dirname, 'not-exited-file.txt')
    expect(utilx.readFile).withArgs(p).to.throwException()
  })

  it('writeFile', function() {
    var p = path.join(__dirname, 'a', 'b', 'c.txt')
    expect(utilx.isExistedFile(p)).to.be(false)
    utilx.writeFile(p, 'some text')
    expect(utilx.isExistedFile(p)).to.be(true)
    expect(utilx.readFile(p)).to.be('some text')
    fs.unlinkSync(p)
  })

  it('remove', function() {
    var dir = path.join(__dirname, 'a')
    var p1 = path.join(__dirname, 'a', 'b', 'c.txt')
    var p2 = path.join(__dirname, 'a', 'd.txt')
    utilx.writeFile(p1, 'some text')
    utilx.writeFile(p2, 'some text')
    expect(utilx.isExistedFile(p1)).to.be(true)
    utilx.remove(p1)
    expect(utilx.isExistedFile(p1)).to.be(false)

    expect(utilx.isExistedDir(dir)).to.be(true)
    utilx.remove(dir)
    expect(utilx.isExistedFile(p2)).to.be(false)
    expect(utilx.isExistedDir(dir)).to.be(false)
  })

  describe('readJSON', function() {
    it('pass a not exist file and return an empty plain object', function() {
      var p = path.join(__dirname, 'path', 'to', 'not-existed-file.json')
      var rt = utilx.readJSON(p)
      expect(Object.keys(rt).length).to.be(0)
      expect(JSON.stringify(rt)).to.be('{}')
    })

    it('pass a not proper file and return an empty plain object', function() {
      var p = path.join(__dirname, 'not-proper-file.txt')
      fs.writeFileSync(p, 'some text')

      var rt = utilx.readJSON(p)
      expect(Object.keys(rt).length).to.be(0)
      expect(JSON.stringify(rt)).to.be('{}')

      fs.unlinkSync(p)
    })

    it('pass a proper file and return a plain object', function() {
      var p = path.join(__dirname, 'proper-file.json')
      fs.writeFileSync(p, '{"nick": "fool2fish", "job": "web developer"}')

      var rt = utilx.readJSON(p)
      expect(Object.keys(rt).length).to.be(2)
      expect(rt.nick).to.be('fool2fish')
      expect(rt.job).to.be('web developer')

      fs.unlinkSync(p)
    })

  })

  describe('writeJSON', function() {
    it('create it first if the file not exist', function() {
      var p = path.join(__dirname, 'path', 'to', 'not-existed-config.json')
      utilx.writeJSON(p, {nick: 'fool2fish', blog: 'fool2fish.cn'})

      var cfg = require(p)
      expect(Object.keys(cfg).length).to.be(2)
      expect(cfg.nick).to.be('fool2fish')
      expect(cfg.blog).to.be('fool2fish.cn')

      fs.unlinkSync(p)
      fs.rmdirSync(path.join(__dirname, 'path', 'to'))
      fs.rmdirSync(path.join(__dirname, 'path'))
    })

    it('cover old content', function() {
      var p = path.join(__dirname, 'existed-config.json')
      fs.writeFileSync(p, '{"nick": "fool2fish", "job": "web developer"}')

      utilx.writeJSON(p, {nick: 'fool2fish', twitter: 'fool2fish'})

      var cfg = require(p)
      expect(Object.keys(cfg).length).to.be(2)
      expect(cfg.nick).to.be('fool2fish')
      expect(cfg.twitter).to.be('fool2fish')
      expect(cfg.blog).to.be(undefined)

      fs.unlinkSync(p)
    })
  })

  it('noCacheRequire', function() {
    var p = path.join(__dirname, 'no-cache-require-fixture')
    utilx.writeFile(p, 'module.exports = 0')
    var m = utilx.noCacheRequire(p)
    expect(m).to.be(0)
    utilx.writeFile(p, 'module.exports = 1')
    m = utilx.noCacheRequire(p)
    expect(m).to.be(1)
    utilx.remove(p)
  })

  describe('mix', function() {
    describe('overwrite', function() {

      it('not overwrite', function() {
        var rt = utilx.mix({}, {a:'first'}, {a:'second'}, false)
        expect(rt.a).to.be('first')
      })

      it('overwrite', function() {
        var rt = utilx.mix({}, {a:'first'}, {a:'second'}, true)
        expect(rt.a).to.be('second')
      })
    })

    it('any of arguments could be null', function() {
      var rt1 = utilx.mix(null, {a: 'first'}, false)
      expect(Object.keys(rt1).length).to.be(1)
      expect(rt1.a).to.be('first')

      var rt2 = utilx.mix({a: 'zero'}, null, {a: 'second'}, true)
      expect(Object.keys(rt2).length).to.be(1)
      expect(rt2.a).to.be('second')

      var rt3 = utilx.mix({a: 'zero'}, {a: 'first'}, {a: 'second', b: 'second'})
      expect(Object.keys(rt3).length).to.be(2)
      expect(rt3.a).to.be('zero')
      expect(rt3.b).to.be('second')
    })
  })

  it('getExternalIpAddress', function() {
    var rt = utilx.getExternalIpAddress()
    var interfaces = require('os').networkInterfaces()
    var addresses = []
    Object.keys(interfaces).forEach(function(name) {
      addresses = addresses.concat(interfaces[name])
    })
    addresses = addresses.filter(function(node) {
      if (node.family === 'IPv4' && node.internal === false) {
        return true
      }
    })

    if (addresses.length) {
      expect(rt).to.be(addresses[0].address)
    } else {
      expect(rt).to.be(null)
    }
  })

  it.skip('cGetCfg', function() {
    commander
      .description('a commander')
      .option('--nick [s]', 'a name')
      .option('--favorite [s]', 'a favorite')
      .parse(['node', 'scriptpath', '--nick=fool2fish', '--favorite=imax'])
    var rt = utilx.cGetCfg(commander)
    expect(Object.keys(rt).length).to.be(2)
    expect(rt.nick).to.be('fool2fish')
    expect(rt.favorite).to.be('imax')
  })

  it('isUrl', function() {
    expect(utilx.isUrl(undefined)).to.be(false)
    expect(utilx.isUrl(false)).to.be(false)
    expect(utilx.isUrl(null)).to.be(false)
    expect(utilx.isUrl('')).to.be(false)
    expect(utilx.isUrl('a.com')).to.be(false)
    expect(utilx.isUrl('http://a.com')).to.be(true)
    expect(utilx.isUrl('https://a.com')).to.be(true)
  })

  it('isKeyword', function() {
    expect(utilx.isKeyword(undefined)).to.be(false)
    expect(utilx.isKeyword(false)).to.be(false)
    expect(utilx.isKeyword(null)).to.be(false)
    expect(utilx.isKeyword('http://a.com')).to.be(false)
    expect(utilx.isKeyword('')).to.be(false)
    expect(utilx.isKeyword('a/b/c')).to.be(false)
    expect(utilx.isKeyword('abc')).to.be(true)
  })
})
