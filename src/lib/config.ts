import { Config } from './model'


export const defaultConfig: Config = {
  maxMsgLength: 1024,
  runLevel: 'log',
  persist: true,
  persistTTL: 7 * 24 * 3600,
  storagePrefix: 'log',
}

