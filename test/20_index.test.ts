/// <reference types="mocha" />

import * as assert from 'power-assert'

import {
  getAvailableLogLevel, getConfig, setConfig, Config,
} from '../src/index'
import { defaultConfig } from '../src/lib/config'
import { basename } from '../src/shared/index'


const filename = basename(__filename)
const logLevelArr = getAvailableLogLevel()
const oriConfig = { ...defaultConfig }

describe(filename, () => {
  const config: Partial<Config> = { }

  after(() => setConfig(oriConfig))

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

})
