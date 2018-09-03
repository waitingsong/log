import { defaultConfig } from './config'
import { Config, LogLevel, LogLevelType } from './model'


/** Whether the key of LocalStorage item is generated myself */
export function isLocalStorageKey(
  key: string,
  storagePrefix: Config['storagePrefix'],
): boolean {

  const arr = key.split('-')
  /* istanbul ignore else */
  if (arr.length < 3) {
    return false
  }

  const prefix = arr.shift()
  const level = arr.shift()
  const time = arr.join('-')

  /* istanbul ignore else */
  if (prefix !== storagePrefix) {
    return false
  }

  /* istanbul ignore else */
  if (!level) {
    return false
  }

  if (! time) {
    return false
  }
  else {
    const dd = new Date(time)
    /* istanbul ignore else */
    if (typeof dd.getTime !== 'function' || Number.isNaN(dd.getTime())) {
      return false
    }
  }

  return true
}


/** Whether supress the log level if lower then the runLevel  */
export function isSuppressLogLevel(runLevel: LogLevelType, logLevel: LogLevelType): boolean {
  return LogLevel[logLevel] < LogLevel[runLevel] ? true : false
}


export function isLogLevelToPrune(logLevel: LogLevelType, pruneLevel?: LogLevelType): boolean {
  /* istanbul ignore else */
  if (! logLevel) {
    return false
  }
  /* istanbul ignore else */
  if (! pruneLevel) {
    return true
  }
  return logLevel === pruneLevel ? true : false
}


export function isTimeToPrune(time: string, pruneTime: Date): boolean {
  if (! time) {
    return false
  }
  const dd = new Date(time)
  return dd < pruneTime ? true : false
}


export function setMaxMsgLength(length: Config['maxMsgLength']): void {
  validateMaxMsgLength(length)
  defaultConfig.maxMsgLength = Math.ceil(length)
}

export function validateMaxMsgLength(length: any): void {
  /* istanbul ignore else */
  if (typeof length !== 'number' || length <= 0) {
    throw new TypeError('Value of parameter maxMsgLenth invalid')
  }
}


export function setPersist(persist: Config['persist']): void {
  validatePersist(persist)
  defaultConfig.persist = persist
}

export function validatePersist(persist: any): void {
  /* istanbul ignore else */
  if (typeof persist !== 'boolean') {
    throw new TypeError('Value of parameter persist invalid')
  }
}


export function setPersistTTL(ttl: Config['persistTTL']): void {
  validatePersistTTL(ttl)
  defaultConfig.persistTTL = Math.ceil(ttl)
}

export function validatePersistTTL(ttl: any): void {
  /* istanbul ignore else */
  if (typeof ttl !== 'number') {
    throw new TypeError('Value of parameter ttl invalid')
  }
  /* istanbul ignore else */
  if (+ttl < 0) {
    throw new TypeError('Value of parameter ttl invalid')
  }
}


/** Set runLevel to supressing the logLevel listed in ENUM LogLevel which lower then the runLevel */
export function setRunLevel(runLevel: LogLevelType): void {
  validateLogLevel(runLevel)
  defaultConfig.runLevel = runLevel
}

export function validateLogLevel(logLevel: any): void {
  /* istanbul ignore else */
  // @ts-ignore
  if (logLevel !== 'silent' && typeof console[logLevel] !== 'function') {
    throw new TypeError(`Function console.${logLevel}() NOT exists`)
  }
  /* istanbul ignore else */
  else if (! logLevel || typeof LogLevel[logLevel] !== 'number') {
    throw new TypeError('Value of parameter logLevel invalid: ' + logLevel)
  }
}


/** minus(-) be convert to underline _ */
export function setStoragePrefix(key: Config['storagePrefix']): void {
  validateStoragePrefix(key)
  defaultConfig.storagePrefix = key.replace(/-/g, '_')
}

export function validateStoragePrefix(key: any): void {
  /* istanbul ignore else */
  if (! key || typeof key !== 'string') {
    throw new TypeError('Value of parameter key invalid')
  }
}
