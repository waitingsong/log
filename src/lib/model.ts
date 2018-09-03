export enum LogLevel { trace, debug, log, info, warn, error, silent }

export type LogLevelType = keyof typeof LogLevel

export type PlainLogMsg = string | number | Error | object
export type LogMsgType = PlainLogMsg | PlainLogMsg[]

export interface Config {
  /** maximal log message length in Byte. Default: 1024 Byte */
  maxMsgLength: number

  /** Whether store error message in LocalStorage */
  persist: boolean
  /**
   * TTL (sec) for error in LocalStorage,
   * pruned automatically when expiry
   * Default: 604800(sec) (equal to 7days)
   */
  persistTTL: number

  /**
   * runLevel to supressing the logLevel listed in ENUM LogLevel which lower then the runLevel
   */
  runLevel: LogLevelType

  /** prefix for LocalStorage */
  storagePrefix: string
}
