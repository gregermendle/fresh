/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */

/* auto-generated by NAPI-RS */

const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim()
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'fresh.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.android-arm64.node')
          } else {
            nativeBinding = require('fresh-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'fresh.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.android-arm-eabi.node')
          } else {
            nativeBinding = require('fresh-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'fresh.win32-x64-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.win32-x64-msvc.node')
          } else {
            nativeBinding = require('fresh-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(join(__dirname, 'fresh.win32-ia32-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('fresh-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'fresh.win32-arm64-msvc.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('fresh-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'fresh.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./fresh.darwin-universal.node')
      } else {
        nativeBinding = require('fresh-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'fresh.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.darwin-x64.node')
          } else {
            nativeBinding = require('fresh-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'fresh.darwin-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.darwin-arm64.node')
          } else {
            nativeBinding = require('fresh-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'fresh.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./fresh.freebsd-x64.node')
      } else {
        nativeBinding = require('fresh-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-x64-musl.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-x64-musl.node')
            } else {
              nativeBinding = require('fresh-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-x64-gnu.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-x64-gnu.node')
            } else {
              nativeBinding = require('fresh-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-arm64-musl.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-arm64-musl.node')
            } else {
              nativeBinding = require('fresh-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-arm64-gnu.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('fresh-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-arm-musleabihf.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-arm-musleabihf.node')
            } else {
              nativeBinding = require('fresh-linux-arm-musleabihf')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-arm-gnueabihf.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-arm-gnueabihf.node')
            } else {
              nativeBinding = require('fresh-linux-arm-gnueabihf')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'riscv64':
        if (isMusl()) {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-riscv64-musl.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-riscv64-musl.node')
            } else {
              nativeBinding = require('fresh-linux-riscv64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(join(__dirname, 'fresh.linux-riscv64-gnu.node'))
          try {
            if (localFileExisted) {
              nativeBinding = require('./fresh.linux-riscv64-gnu.node')
            } else {
              nativeBinding = require('fresh-linux-riscv64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 's390x':
        localFileExisted = existsSync(join(__dirname, 'fresh.linux-s390x-gnu.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./fresh.linux-s390x-gnu.node')
          } else {
            nativeBinding = require('fresh-linux-s390x-gnu')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { serve: _serve } = nativeBinding

function getHeaders(headers) {
  return Object.fromEntries(headers.map(({ key, value }) => [key, new TextDecoder().decode(new Uint8Array(value))]))
}

async function freshResponse(res) {
  return {
    status: res.status,
    headers: [...res.headers.entries()],
    body: [...new Uint8Array(await res.arrayBuffer())],
  }
}

function serve(handle, port) {
  return new Promise((resolve, reject) => {
    _serve(
      async (err, req) => {
        if (err) {
          return reject(err)
        }

        let res = await handle(
          new Request(req.url, {
            method: req.method,
            headers: getHeaders(req.headers),
          }),
        )
        
        return freshResponse(res)
      },
      port,
      (err, ...args) => {
        if (err) {
          return reject(err)
        }

        resolve(...args)
      },
    )
  })
}

module.exports.serve = serve
