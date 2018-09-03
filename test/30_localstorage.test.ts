/// <reference types="mocha" />

import { LocalStorage } from 'node-localstorage'
import * as assert from 'power-assert'
import { of } from 'rxjs'
import { delay, tap } from 'rxjs/operators'

// import {
//   getAvailableLogLevel, getConfig, LogLevel, LogLevelType,
// } from '../src/index'
import * as mylog from '../src/index'
import { defaultConfig } from '../src/lib/config'
import { localSave, pruneLogs } from '../src/lib/localstorage'
import { setRunLevel } from '../src/lib/util'
import { basename, join, rimraf, tmpdir } from '../src/shared/index'


const filename = basename(__filename)
const tmpDir = join(tmpdir(), 'log-test-tmp')
const logLevelArr = mylog.getAvailableLogLevel()

describe(filename, () => {
  const message = 'logmsg^a"b\'c<d>e&f'

  before(() => {
    // @ts-ignore
    global.localStorage = new LocalStorage(tmpDir)
  })

  after(() => {
    rimraf(tmpDir)
    // @ts-ignore
    delete process.localStorage
  })

  describe('Should localSave() works', () => {
    it('with valid params', () => {
      logLevelArr.forEach(level => {
        const now = new Date()
        const msg = message + Math.random()
        const key = localSave(level, msg, 'logsprefix', 1024)
        if (level === 'silent') {
          assert(key === '')
          return
        }
        const time = key.split('-').slice(2).join('-')
        const diff = (new Date(time).getTime()) - now.getTime()
        assert(diff < 100)

        const value = localStorage.getItem(encodeURIComponent(key))
        const content = JSON.parse(value ? value : '')
        assert(content === msg)
      })
    })

    it('Should maxLen works', () => {
      logLevelArr.forEach(level => {
        const now = new Date()
        const msg = message + Math.random()
        const key = localSave(level, msg, 'logsprefix', message.length)
        if (level === 'silent') {
          assert(key === '')
          return
        }
        const time = key.split('-').slice(2).join('-')
        const diff = (new Date(time).getTime()) - now.getTime()
        assert(diff < 100)

        const value = localStorage.getItem(encodeURIComponent(key))
        const content = JSON.parse(value ? value : '')
        const expect = message + ' ...'
        assert(content === expect)
      })
    })

    it('Should saved items correctly', () => {

    })
  })

  describe('Should saved items correctly', () => {
    after(() => {
      setRunLevel('error')
      localStorage.clear()
    })

    it('with all available levels with persist:undefined (default:true)', () => {
      const arrLen = logLevelArr.length

      logLevelArr.forEach((runLevel, idx) => {
        const expectItemCount = arrLen - idx - 1  // -1 for silent

        localStorage.clear()
        setRunLevel(runLevel)

        logLevelArr.forEach(level => {
          const msg = 'foo' + Math.random()
          mylog[level](msg)
        })

        assert(localStorage.length === expectItemCount)
      })
    })

    it('with all available levels with persist:true', () => {
      const arrLen = logLevelArr.length

      logLevelArr.forEach((runLevel, idx) => {
        const expectItemCount = arrLen - idx - 1  // -1 for silent

        localStorage.clear()
        setRunLevel(runLevel)

        logLevelArr.forEach(level => {
          const msg = 'foo' + Math.random()
          mylog[level](msg)
        })

        assert(localStorage.length === expectItemCount)
      })
    })

    it('with all available levels with persist:false', () => {
      logLevelArr.forEach((runLevel, idx) => {
        const expectItemCount = 0

        localStorage.clear()
        setRunLevel(runLevel)

        logLevelArr.forEach(level => {
          const msg = 'foo' + Math.random()
          mylog[level](msg, false)
        })

        assert(localStorage.length === expectItemCount)
      })
    })
  })


  describe('Should pruneLogs() works', () => {
    beforeEach(() => localStorage.clear())
    after(() => {
      setRunLevel('error')
      localStorage.clear()
    })

    it('to all', resolve => {
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            logLevelArr.forEach(level => {
              const msg = 'foo' + Math.random()
              mylog[level](msg)
            })
          }),
          delay(100),
          tap(() => {
            pruneLogs(defaultConfig.storagePrefix, new Date())
          }),
          delay(1000),
        )
        .subscribe(
          () => {
            assert(
              localStorage.length === 0,
              `Expect zero but got ${localStorage.length}. May delete operation not finished`)
            resolve()
          },
          err => {
            assert(false, err)
            resolve()
          },
        )
    })

    it('to all with extra invalid item', resolve => {
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            logLevelArr.forEach(level => {
              const msg = 'foo' + Math.random()
              mylog[level](msg)
            })
            localStorage.setItem('foo', 'bar')  // extra
          }),
          delay(100),
          tap(() => {
            pruneLogs(defaultConfig.storagePrefix, new Date())
          }),
          delay(1000),
        )
        .subscribe(
          () => {
            assert(
              localStorage.length === 1,
              `Expect zero but got ${localStorage.length}. May delete operation not finished`)
            resolve()
          },
          err => {
            assert(false, err)
            resolve()
          },
        )
    })


    it('none for pruneTime', resolve => {
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            logLevelArr.forEach(level => {
              const msg = 'foo' + Math.random()
              mylog[level](msg)
            })
          }),
          delay(100),
          tap(() => {
            pruneLogs(defaultConfig.storagePrefix, new Date(0))
          }),
          delay(1000),
        )
        .subscribe(
          () => {
            assert(
              localStorage.length === logLevelArr.length - 1,
              `Expect zero but got ${localStorage.length}. May delete operation not finished`)
            resolve()
          },
          err => {
            assert(false, err)
            resolve()
          },
        )
    })

    it('to only debug', resolve => {
      setRunLevel('trace')

      of(1)
        .pipe(
          tap(() => {
            logLevelArr.forEach(level => {
              const msg = 'foo' + Math.random()
              mylog[level](msg)
            })
          }),
          delay(100),
          tap(() => {
            pruneLogs(defaultConfig.storagePrefix, new Date(), 'debug')
          }),
          delay(1000),
        )
        .subscribe(
          () => {
            assert(
              localStorage.length === logLevelArr.length - 2,
              `Expect zero but got ${localStorage.length}. May delete operation not finished`)
            resolve()
          },
          err => {
            assert(false, err)
            resolve()
          },
        )
    })
  })
})
