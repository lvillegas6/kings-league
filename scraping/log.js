import pc from 'picocolors'

const symbols = {
  info: pc.cyan('ℹ'),
  success: pc.green('✔'),
  warning: pc.yellow('⚠'),
  error: pc.red('✖')
}

export const logError = (...args) => console.error(symbols.error, pc.red('[ERROR]'), ...args)
export const logWarn = (...args) => console.warn(symbols.warning, pc.yellow('[WARN]'), ...args)
export const logInfo = (...args) => console.info(symbols.info, pc.cyan('[INFO]'), ...args)
export const logSuccess = (...args) => console.log(symbols.success, pc.green('[SUCCESS]'), ...args)
