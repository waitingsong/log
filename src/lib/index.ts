import { defaultConfig } from './config'
import { localSave } from './localstorage'
import { logger } from './logger'
import { Config, LogLevel, LogLevelType, LogMsgType } from './model'
import {
  isSuppressLogLevel,
  setMaxMsgLength,
  setPersist,
  setPersistTTL,
  setRunLevel,
  setStoragePrefix,
  validateLogLevel,
} from './util'


export function trace(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('trace', data, persist)
}


export function debug(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('debug', data, persist)
}


export function log(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('log', data, persist)
}


export function info(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('info', data, persist)
}


export function warn(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('warn', data, persist)
}


export function error(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('error', data, persist)
}


export function silent(
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {
  return proxy('silent', data, persist)
}



/** Get copy of defaultConfig */
export function getConfig(): Config {
  return { ...defaultConfig }
}


/** Set value of key of defaultConfig and return copy of defaultConfig */
export function setConfig(config: Partial<Config>): Config {
  if (config && typeof config === 'object') {
    for (const [key, value] of Object.entries(config)) {
      switch (<keyof Config> key) {
        case 'maxMsgLength':
          setMaxMsgLength(<Config['maxMsgLength']> value)
          break

        case 'persist':
          setPersist(<Config['persist']> value)
          break

        case 'persistTTL':
          setPersistTTL(<Config['persistTTL']> value)
          break

        case 'runLevel':
          setRunLevel(<Config['runLevel']> value)
          break

        case 'storagePrefix':
          setStoragePrefix(<Config['storagePrefix']> value)
          break

        /* istanbul ignore next */
        default:
          info(`setConfig(config): value of param invalid: key "${key}"/value "${value}"`)
          break
      }
    }
  }
  else {
    info(`setConfig(config): value of param invalid: "${config}"`)
  }

  return getConfig()
}


export function getAvailableLogLevel(): LogLevelType[] {
  const ret: LogLevelType[] = []

  Object.keys(LogLevel).forEach(key => {
    if (key && typeof key === 'string' && Number.isNaN(+key)) {
      try {
        validateLogLevel(key)
        ret.push(<LogLevelType> key)
      }
      catch (ex) {
        // void
      }
    }
  })

  return ret
}


/**
 * @returns void or key of LocalStorage Item (if persist true)
 */
function proxy(
  level: LogLevelType,
  data: LogMsgType,
  persist?: Config['persist'],
): void | ReturnType<typeof localSave> {

  /* istanbul ignore else */
  if (isSuppressLogLevel(defaultConfig.runLevel, level)) {
    return
  }
  /* istanbul ignore else */
  if (level === 'silent') {
    return
  }

  logger(level, data)

  const persistNew = typeof persist === 'boolean' ? persist : defaultConfig.persist
  if (persistNew) {
    localSave(level, data, defaultConfig.storagePrefix, defaultConfig.maxMsgLength)
  }
}
