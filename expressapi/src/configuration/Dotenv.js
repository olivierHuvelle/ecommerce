import path from 'path'
import { config } from 'dotenv'
import { PathUtils } from '@/utils/PathUtils'

export const ENVIRONMENTS = Object.freeze({
	PROD: '.env',
	DEV: '.env.dev',
	TEST: '.env.test',
})

export class Dotenv {
	constructor(ENVIRONMENTS) {
		this.ENVIRONMENTS = ENVIRONMENTS
		this.environment = process.env.NODE_ENV
		const envFilePath = path.join(PathUtils.getRootPath(), this.ENVIRONMENTS[this.environment])
		config({ path: envFilePath })
	}

	get environment() {
		return this._environment
	}

	set environment(value) {
		if (!Object.keys(this.ENVIRONMENTS).includes(value)) {
			throw new Error(`invalid environment ${value}, allowed ${Object.keys(this.ENVIRONMENTS)}`)
		}
		this._environment = value
	}
}
