import { LogLevelType, LogMsgType } from './model'


export function logger(
  level: LogLevelType,
  message: LogMsgType,
): void {

  /* istanbul ignore else */
  if (level === 'silent') {
    return
  }

  if (Array.isArray(message)) {
    console.group('Group log:')
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < message.length; i++) {
      // @ts-ignore
      console[level](message[i])
    }
    console.groupEnd()
  }
  else {
    // @ts-ignore
    console[level](message)
  }

}
