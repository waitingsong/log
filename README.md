# Log

Lightweight simple ECMAScript logging for Browser and Node.js

[![Version](https://img.shields.io/npm/v/@waiting/log.svg)](https://www.npmjs.com/package/@waiting/log)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/waitingsong/log.svg?branch=master)](https://travis-ci.org/waitingsong/log)
[![Build status](https://ci.appveyor.com/api/projects/status/e159mr35e44e5274/branch/master?svg=true)](https://ci.appveyor.com/project/waitingsong/log/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/waitingsong/log/badge.svg?branch=master)](https://coveralls.io/github/waitingsong/log?branch=master)

## Features

- Loggin things (message, data) at a given level with API `trace()`, `debug()`, `log()`, `info()`, `warn()`, `error()`
- Filter logging by runLevel (all the below or 'silent'), so you can run site with default runLevel `error`, and run `setRunLevel('trace')` for debugging


## Installing

```bash
npm install @waiting/log
```

## Usage

### log with desired API

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

### log with single API

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
