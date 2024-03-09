import winston from 'winston'
import { format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import container from '@/container'
import { PathUtils } from '@/utils/PathUtils'
import path from 'path'

const lvlFilter = lvl =>
	// eslint-disable-next-line no-unused-vars
	winston.format((info, opts) => {
		if (!lvl) {
			return info
		}
		return info.level === lvl ? info : false
	})

const generateFileTransport = (filename, lvl = undefined) => {
	const fileObj = {
		filename: path.join(PathUtils.getRootPath(), 'logs', `%DATE%-${filename}.log`),
		datePattern: 'YYYY-MM-DD',
		maxFiles: '14d',
	}
	if (lvl) {
		fileObj['format'] = format.combine(lvlFilter(lvl)(), format.json(), format.timestamp(), format.prettyPrint())
		fileObj['level'] = lvl
	}
	return new DailyRotateFile(fileObj)
}

const generateConsoleTransport = minLevel => {
	if (!container.resolve('Environment').getOrFail('LOG_DO_CONSOLE')) {
		return undefined
	}
	return new winston.transports.Console({
		level: minLevel,
		format: format.combine(format.json(), format.timestamp(), format.prettyPrint()),
	})
}

export const logger = winston.createLogger({
	level: container.resolve('Environment').getOrFail('LOG_LVL'),
	transports: [
		generateFileTransport('combined'),
		generateFileTransport('error', 'error'),
		generateFileTransport('warning', 'warn'),
		generateFileTransport('info', 'info'),
		generateFileTransport('debug', 'debug'),
		generateConsoleTransport(container.resolve('Environment').getOrFail('LOG_LVL')),
	],
	format: format.combine(format.json(), format.timestamp(), format.prettyPrint()),
	statusLevels: true,
})
