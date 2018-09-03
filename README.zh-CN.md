# Log

轻量级 ECMAScript 日志，支持浏览器和 Node.js

[![Version](https://img.shields.io/npm/v/@waiting/log.svg)](https://www.npmjs.com/package/@waiting/log)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/waitingsong/log.svg?branch=master)](https://travis-ci.org/waitingsong/log)
[![Build status](https://ci.appveyor.com/api/projects/status/e159mr35e44e5274/branch/master?svg=true)](https://ci.appveyor.com/project/waitingsong/log/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/waitingsong/log/badge.svg?branch=master)](https://coveralls.io/github/waitingsong/log?branch=master)

## 特点

- 记录文本以及数据，通过不同级别接口 `trace()`, `debug()`, `log()`, `info()`, `warn()`, `error()`
- 根据 runLevel 设定值过滤掉低级别的日志记录。通过执行切换运行日志等级 `setRunLevel('trace')` 执行临时代码调试，而网站运行在默认的 `error` 级别


## 安装

```bash
npm install @waiting/log
```

## 使用
### 导入需要的接口执行

```ts
import { error, trace, setRunLevel } from '@waiting/log'

error('log message')

setRunLevel('trace')
const data = {
  foo: new Date()
}
trace(data)
setRunLevel('error')  // turn trace off
```

### 整体导入执行

```ts
import * as log from '@waiting/log'

log.error('log message')

log.setRunLevel('trace')
const data = {
  foo: new Date()
}
log.log(data) // equal to console.log()
log.setRunLevel('error')  // turn debug off
```


### On Node.js

- Needs polylfill [node-localstorage](https://www.npmjs.com/search?q=node-localstorage) for persistent logging

  ```ts
  import { LocalStorage } from 'node-localstorage'

  // @ts-ignore
  global.localStorage = new LocalStorage(<path>)
  ```


## Demos

- [Node.js](https://github.com/waitingsong/log/blob/master/test/)

## License

[MIT](LICENSE)

### Languages

- [English](README.md)
- [中文](README.zh-CN.md)
