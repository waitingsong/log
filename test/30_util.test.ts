/// <reference types="mocha" />

import * as assert from 'power-assert'

import {
  getAvailableLogLevel, getConfig, LogLevel, LogLevelType,
} from '../src/index'
import {
  isLocalStorageKey,
  isLogLevelToPrune,
  isSuppressLogLevel,
  isTimeToPrune,
  setMaxMsgLength,
  setPersist,
  setPersistTTL,
  setRunLevel,
  setStoragePrefix,
  validateLogLevel,
  validateMaxMsgLength,
  validatePersist,
  validatePersistTTL,
  validateStoragePrefix,
} from '../src/lib/util'
import { basename } from '../src/shared/index'


const filename = basename(__filename)
const logLevelArr = getAvailableLogLevel()

describe(filename, () => {

  describe('Should isLocalStorageKey() works', () => {
    it('expect true', () => {
      const ret = isLocalStorageKey('logs-debug-2018-09-02T12:22:22.775Z', 'logs')
      assert(ret)
    })
    it('expect false', () => {
      let ret = isLocalStorageKey('logs-debug-20180902T12:22:22.775Z', 'logs')
      assert(!ret)

      ret = isLocalStorageKey('logs--2018-09-02T12:22:22.775Z', 'logs')
      assert(!ret)

      ret = isLocalStorageKey('logs-debug-', 'logs')
      assert(!ret)

      ret = isLocalStorageKey('logs-debug', 'logs')
      assert(!ret)

      ret = isLocalStorageKey('logs-debug-2018-09-02T12:22:22.775Z', 'log')
      assert(!ret)
    })
  })


  describe('Should isLogLevelToPrune() works', () => {
    it('expect true', () => {
      logLevelArr.forEach(value => {
        let ret = isLogLevelToPrune(value, value)
        assert(ret)

        ret = isLogLevelToPrune(value)
        assert(ret)

        // @ts-ignore
        ret = isLogLevelToPrune(value, '')
        assert(ret)
      })
    })
    it('expect false', () => {
      logLevelArr.forEach(value => {
        const nv = LogLevel[value]
        const prev = LogLevel[nv - 1]
        const next = LogLevel[nv + 1]

        if (prev) {
          const prune = isLogLevelToPrune(<LogLevelType> prev, value)
          assert(! prune)
        }
        if (next) {
          const prune = isLogLevelToPrune(<LogLevelType> next, value)
          assert(! prune)
        }

        // @ts-ignore
        let ret = isLogLevelToPrune('', value)
        assert(! ret)

        // @ts-ignore
        ret = isLogLevelToPrune(null, value)
        assert(! ret)
      })

    })
  })


  describe('Should isSuppressLogLevel() works', () => {
    it('all suppressed except silent', () => {
      logLevelArr.forEach(value => {
        if (value === 'silent') {
          return
        }
        const ret = isSuppressLogLevel('silent', value)
        assert(ret)
      })
    })

    it('none suppressed', () => {
      logLevelArr.forEach(value => {
        const ret = isSuppressLogLevel('trace', value)
        assert(! ret)
      })
    })

    it('one suppressed', () => {
      const ret = isSuppressLogLevel('error', 'info')
      assert(ret)
    })

    it('one not suppressed', () => {
      const ret = isSuppressLogLevel('info', 'error')
      assert(! ret)
    })
  })


  describe('Should isTimeToPrune() works', () => {
    it('expect true', () => {
      let ret = isTimeToPrune('2018-09-03T07:04:19.750Z', new Date())
      assert(ret)

      ret = isTimeToPrune('2011-09-03T07:04:19.750Z', new Date('2018-09-03T07:04:19.750Z'))
      assert(ret)

      ret = isTimeToPrune('December 17, 1995 03:24:00', new Date('2018-09-03T07:04:19.750Z'))
      assert(ret)

      ret = isTimeToPrune('2018-09-03', new Date('2018-09-03T07:04:19.750Z'))
      assert(ret)

      ret = isTimeToPrune('2018/09/03', new Date('2018-09-03T07:04:19.750Z'))
      assert(ret)

      // @ts-ignore
      ret = isTimeToPrune(1453094034000, new Date('2018-09-03T07:04:19.750Z'))
      assert(ret)
    })

    it('expect false', () => {
      const now = new Date()

      let ret = isTimeToPrune('2018-09-03T07:04:19.750Z', new Date('2018-09-03T07:04:19.750Z'))
      assert(! ret)

      ret = isTimeToPrune(now.toISOString(), new Date('2018-09-03T07:04:19.750Z'))
      assert(! ret)

      ret = isTimeToPrune('', new Date('2018-09-03T07:04:19.750Z'))
      assert(! ret)

      ret = isTimeToPrune(now.toISOString(), now)
      assert(! ret)

      // @ts-ignore
      ret = isTimeToPrune(null, now)
      assert(! ret)

      // @ts-ignore
      ret = isTimeToPrune(null, null)
      assert(! ret)

      // @ts-ignore
      ret = isTimeToPrune(now.toISOString(), null)
      assert(! ret)

      ret = isTimeToPrune('1453094034000', new Date('2018-09-03T07:04:19.750Z'))
      assert(! ret)

      // @ts-ignore
      ret = isTimeToPrune(new Date('2018-09-03T07:04:19.750Z').toISOString(), null)
      assert(! ret)
    })
  })


  describe('Should setMaxMsgLength() works', () => {
    it('with valid param', () => {
      [1024, 1.1].forEach(value => {
        setMaxMsgLength(value)
        const ret = getConfig()
        assert(ret.maxMsgLength === Math.ceil(value))
      })
    })
  })

  describe('Should validateMaxMsgLength() works', () => {
    it('with valid param', () => {
      [1024, 1.1].forEach(value => {
        assert.doesNotThrow(() => validateMaxMsgLength(value))
      })
    })

    it('with invalid param', () => {
      [-1, 0, null, 'foo', void 0].forEach(value => {
        assert.throws(
          () => validateMaxMsgLength(value),
          'Should get Error but NOT with:' + value,
        )
      })
    })
  })


  describe('Should setPersist() works', () => {
    it('with valid param', () => {
      [true, false].forEach(value => {
        setPersist(value)
        const ret = getConfig()
        assert(ret.persist === value)
      })
    })
  })

  describe('Should validatePersist() works', () => {
    it('with valid param', () => {
      [true, false].forEach(value => {
        assert.doesNotThrow(() => validatePersist(value))
      })
    })

    it('with invalid param', () => {
      [1, 0, null, 'foo', void 0].forEach(value => {
        assert.throws(
          () => validatePersist(value),
          'Should get Error but NOT with:' + value,
        )
      })
    })
  })


  describe('Should setPersistTTL() works', () => {
    it('with valid param', () => {
      [0, 1.1, Math.ceil(Math.random() * 100), Infinity].forEach(value => {
        setPersistTTL(value)
        const ret = getConfig()
        assert(ret.persistTTL === Math.ceil(value))
      })
    })
  })

  describe('Should validatePersistTTL() works', () => {
    it('with valid param', () => {
      [0, -0, 1, 0.1, 100.1, 1234567890, Infinity].forEach(value => {
        assert.doesNotThrow(() => validatePersistTTL(value))
      })
    })

    it('with invalid param', () => {
      [-1, -0.1, true, 'foo', void 0].forEach(value => {
        assert.throws(() => validatePersistTTL(value), 'Should get Error but NOT with:' + value)
      })
    })
  })


  describe('Should setRunLevel() works', () => {
    it('with valid param', () => {
      logLevelArr.forEach(value => {
        setRunLevel(value)
        const ret = getConfig()
        assert(ret.runLevel === value)
      })
    })
  })

  describe('Should validateLogLevel() works', () => {
    it('with valid param', () => {
      for (const key of logLevelArr) {
        assert.doesNotThrow(() => validateLogLevel(key))
      }
    })

    it('with invalid param', () => {
      ['warning', 'fake', 123, true, null].forEach(value => {
        assert.throws(
          () => validateLogLevel(value),
          'Should get Error but NOT with:' + value,
        )
      })
    })
  })


  describe('Should setStoragePrefix() works', () => {
    it('with valid param', () => {
      ['ab', Math.random().toString()].forEach(value => {
        setStoragePrefix(value)
        const ret = getConfig()
        assert(ret.storagePrefix === value)
      })
    })
  })

  describe('Should validateStoragePrefix() works', () => {
    it('with valid param', () => {
      ['foo', '13', '-', '_'].forEach(value => {
        assert.doesNotThrow(() => validateStoragePrefix(value))
      })
    })

    it('with invalid param', () => {
      [1, 0, null, '', true, {}, void 0].forEach(value => {
        assert.throws(() => validateStoragePrefix(value), 'Should get Error but NOT with:' + value)
      })
    })
  })

})
