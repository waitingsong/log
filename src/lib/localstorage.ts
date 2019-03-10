import { Config, LogLevelType, LogMsgType } from './model'
import { isLocalStorageKey, isLogLevelToPrune, isTimeToPrune, validateStoragePrefix } from './util'



/**
 * Save message into LocalStorage
 *
 * @returns key of LocalStorage item, blank if 'silent'
 */
export function localSave(
  level: LogLevelType,
  data: LogMsgType,
  prefix: Config['storagePrefix'],
  maxLen: Config['maxMsgLength'],
): string {

  /* istanbul ignore else */
  if (level === 'silent') {
    return ''
  }

  const time = new Date().toISOString()
  const key = `${prefix}-${level}-${time}`

  save(key, data, maxLen)
  return key
}

function save(key: string, data: any, maxLen: Config['maxMsgLength']): void {
  let cont: any = data
  /* istanbul ignore else */
  if (typeof data === 'string' && data.length > maxLen) {
    cont = data.slice(0, maxLen) + ' ...'
  }
  const content = JSON.stringify(cont)
  /* istanbul ignore else */
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem(encodeURIComponent(key), content)
    }
    catch (ex) {
      console.error(ex)
    }
  }
}


/**
 * Remove expiry logs in LocalStorage.
 * If level omit prune all leves
 *
 * @param storagePrefix
 * @param pruneTime - delte logs in LocalStorage before this Time
 * @param logLevel
 */
export function pruneLogs(
  storagePrefix: Config['storagePrefix'],
  pruneTime: Date,
  pruneLogLevel?: LogLevelType,
): void {

  /* istanbul ignore next */
  if (typeof localStorage !== 'object') {
    return
  }

  validateStoragePrefix(storagePrefix)

  const count = localStorage.length

  /* istanbul ignore next */
  if (! count) {
    return
  }

  const encodeKeys: LogLevelType[] = new Array(count)

  // Caution: retrieve keys before delte!!
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < count; i++) {
    // format: <prefix>-<level>-<ISOString>
    // eg: logs-debug-2018-09-02T12:22:22.775Z
    const encodeKey = localStorage.key(i)

    /* istanbul ignore if */
    if (! encodeKey) {
      continue
    }
    else {
      encodeKeys[i] = <LogLevelType> encodeKey
    }
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < count; i++) {
    const encodeKey = encodeKeys[i]
    const key = decodeURIComponent(encodeKey)

    /* istanbul ignore else */
    if (!isLocalStorageKey(key, storagePrefix)) {
      continue
    }

    const arr = key.split('-')
    const logLevel = <LogLevelType> arr[1]
    const time = arr.slice(2).join('-')

    /* istanbul ignore else */
    if (! isLogLevelToPrune(logLevel, pruneLogLevel)) {
      continue
    }

    /* istanbul ignore else */
    if (!isTimeToPrune(time, pruneTime)) {
      continue
    }

    localStorage.removeItem(encodeKey)
  }
}
