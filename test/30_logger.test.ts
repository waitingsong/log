/// <reference types="mocha" />

import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import {
  getAvailableLogLevel, getConfig, LogLevel, LogLevelType,
} from '../src/index'
import { logger } from '../src/lib/logger'


const filename = basename(__filename)
const logLevelArr = getAvailableLogLevel()

describe(filename, () => {
  const msg = 'logmsg'

  describe('Should logger() works', () => {
    it('available method', () => {
      logLevelArr.forEach(level => {
        logger(level, msg)
      })
    })

    it('message array', () => {
      logLevelArr.forEach(level => {
        logger(level, [msg, msg])
      })
    })
  })

})
