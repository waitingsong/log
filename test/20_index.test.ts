/// <reference types="mocha" />

import { LocalStorage } from 'node-localstorage'
import * as assert from 'power-assert'
import { empty, of } from 'rxjs'
import { catchError, delay, tap } from 'rxjs/operators'

import {
  getAvailableLogLevel, getConfig, log, setConfig, setRunLevel, trace, Config,
} from '../src/index'
import { defaultConfig } from '../src/lib/config'
import { basename, join, rimraf, tmpdir } from '../src/shared/index'


const filename = basename(__filename)
const tmpDir = join(tmpdir(), 'log-test-tmp')
const logLevelArr = getAvailableLogLevel()
const oriConfig = { ...defaultConfig }


describe(filename, () => {
  const config: Partial<Config> = { }

  before(() => {
    // @ts-ignore
    global.localStorage = new LocalStorage(tmpDir)
  })

  after(() => {
    setConfig(oriConfig)
    localStorage.clear()
    // @ts-ignore
    delete process.localStorage
  })

  describe('Should setConfig() works', () => {
    it('with maxMsgLength', () => {
      [1, 100, 12345678, Infinity].forEach(value => {
        config.maxMsgLength = value
        setConfig(config)
        const ret = getConfig()
        assert(ret.maxMsgLength === value)
      })
    })

    it('with persist', () => {
      [true, false, true, true, false, false, true].forEach(value => {
        config.persist = value
        setConfig(config)
        const ret = getConfig()
        assert(ret.persist === value)
      })
    })

    it('with persistTTL ', () => {
      [0, 1, 1.1, 1000, Infinity].forEach(value => {
        config.persistTTL = value
        setConfig(config)
        const ret = getConfig()
        assert(ret.persistTTL === Math.ceil(value), `Should get ${Math.ceil(value)} but got ${ret.persistTTL}`)
      })
    })

    it('with runLevel', () => {
      logLevelArr.forEach(value => {
        config.runLevel = value
        setConfig(config)
        const ret = getConfig()
        assert(ret.runLevel === value)
      })
    })

    it('with storagePrefix', () => {
      ['foo', Math.random().toString(), 'foo' + Math.random()].forEach(value => {
        config.storagePrefix = value
        setConfig(config)
        const ret = getConfig()
        assert(ret.storagePrefix === value)
      })
    })

    it('with empty', () => {
      ['', {}, null, void 0].forEach(value => {
        setConfig(oriConfig)
        // @ts-ignore
        setConfig(value)
        const ret = getConfig()
        assert.deepStrictEqual(ret, oriConfig)
      })
    })
  })


  describe('Should log() works', () => {
    beforeEach(() => localStorage.clear())
    after(() => localStorage.clear())

    it('with message', resolve => {
      const msg = 'foo' + Math.random()

      of(1)
        .pipe(
          tap(() => {
            log(msg)
          }),
          delay(100),
          tap(() => {
            const key = localStorage.key(0)
            const value = key && localStorage.getItem(key)
            const data = value && JSON.parse(value)
            assert(data === msg, `Should get ${msg} bug got ${data}`)
            resolve()
          }),
          catchError(err => {
            assert(false, err)
            resolve()
            return empty()
          }),
        )
        .subscribe()
    })

    it('with object', resolve => {
      const obj = {
        foo: 'foo' + Math.random(),
      }

      of(1)
        .pipe(
          tap(() => {
            log(obj)
          }),
          delay(100),
          tap(() => {
            const key = localStorage.key(0)
            const value = key && localStorage.getItem(key)
            const data = value && JSON.parse(value)
            assert.deepStrictEqual(data, obj, `Should get ${obj} bug got ${data}`)
            resolve()
          }),
          catchError(err => {
            assert(false, err)
            resolve()
            return empty()
          }),
        )
        .subscribe()
    })
  })


  describe('Should trace() works', () => {
    beforeEach(() => localStorage.clear())
    after(() => {
      localStorage.clear()
      setRunLevel('error')
    })

    it('with message', resolve => {
      const msg = 'foo' + Math.random()
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            trace(msg)
          }),
          delay(100),
          tap(() => {
            const key = localStorage.key(0)
            const value = key && localStorage.getItem(key)
            const data = value && JSON.parse(value)
            assert(data === msg, `Should get ${msg} bug got ${data}`)
            resolve()
          }),
          catchError(err => {
            assert(false, err)
            resolve()
            return empty()
          }),
        )
        .subscribe()
    })

    it('with object', resolve => {
      const obj = {
        foo: 'foo' + Math.random(),
      }
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            trace(obj)
          }),
          delay(100),
          tap(() => {
            const key = localStorage.key(0)
            const value = key && localStorage.getItem(key)
            const data = value && JSON.parse(value)
            assert.deepStrictEqual(data, obj, `Should get ${obj} bug got ${data}`)
            resolve()
          }),
          catchError(err => {
            assert(false, err)
            resolve()
            return empty()
          }),
        )
        .subscribe()
    })
  })

})
