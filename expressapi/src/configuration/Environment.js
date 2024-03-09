import fs from 'fs'
import path from 'path'
import validator from 'validator'
import { PathUtils } from '@/utils/PathUtils'

export class EnvField {
	constructor(name, isRequired = false, type = 'string', defaultValue = undefined, validationFn = undefined) {
		const allowedTypes = ['string', 'integer', 'number', 'array', 'file', 'boolean']

		if (!allowedTypes.includes(type)) {
			throw new Error(`invalid type ${type}, allowed ${allowedTypes}`)
		}

		this.name = name
		this.isRequired = isRequired

		if (this.isRequired) {
			this.value = process.env[this.name]
		} else {
			this.value = process.env[this.name] ? process.env[this.name] : `${defaultValue}`
		}

		this.type = type
		this.validationFn = validationFn
		this._validate()
		this._parseValue()
	}

	_validate() {
		this._validateIsRequired()
		this._validateType()
		this._extraValidation()
	}

	_validateIsRequired() {
		// check if key is in .env file + if value in .env
		if (this.isRequired) {
			if (this.value === undefined) {
				throw new Error(`Missing mandatory key ${this.name} in the dotenv file`)
			} else if (this.value === '') {
				throw new Error(`Missing mandatory value at key ${this.name} in the dotenv file`)
			}
		}
	}

	_validateType() {
		// check the type
		const generateTypeError = type => {
			throw new Error(`invalid type for key ${this.name} expected ${type}, current value ${this.value}`)
		}

		switch (this.type) {
			case 'string':
				break
			case 'file':
				break
			case 'integer':
				if (!validator.isInt(this.value)) {
					generateTypeError('integer')
				}
				break
			case 'array':
				try {
					const correctedStr = this.value.replace(/(\w+)/g, '"$1"')
					if (!Array.isArray(JSON.parse(correctedStr))) {
						generateTypeError('array')
					}
				} catch (error) {
					generateTypeError('array')
				}
				break
			case 'number': {
				if (!validator.isNumeric(this.value)) {
					generateTypeError('number')
				}
				break
			}
			case 'boolean': {
				if (!['true', 'false'].includes(this.value)) {
					generateTypeError('boolean')
				}
				break
			}
			default:
				break
		}
	}

	_extraValidation() {
		// optional extra-validation
		if (this.validationFn && !this.validationFn(this.value)) {
			throw new Error(`Extra validation for key ${this.name} failed`)
		}
	}

	_parseValue() {
		const parseMapper = {
			string: value => value,
			integer: value => parseInt(value),
			number: value => Number(value),
			array: value => {
				const correctedStr = value.replace(/(\w+)/g, '"$1"')
				return JSON.parse(correctedStr)
			},
			file: value => {
				return fs.readFileSync(path.join(PathUtils.getRootPath(), value))
			},
			boolean: value => {
				return value === 'true'
			},
		}
		this.value = parseMapper[this.type](this.value)
	}
}

export class Environment {
	// eslint-disable-next-line no-unused-vars
	constructor(Dotenv) {
		this.fields = [
			new EnvField('SERVER_PORT', true, 'integer', 3000, value => validator.isInt(value, { min: 0 })),
			new EnvField('SERVER_SUBDOMAIN', true, 'string', undefined, value => validator.isLength(value, { min: 0 })),
			new EnvField('CORS_ALLOWED_ORIGIN', true, 'string', undefined, value =>
				validator.isLength(value, { min: 1 })
			),
			new EnvField('WINDOW_DURATION_IN_MS', false, 'integer', 60000, value => validator.isInt(value, { min: 1 })),
			new EnvField('WINDOW_NB_REQUEST', false, 'integer', 60000, value => validator.isInt(value, { min: 1 })),
			new EnvField('SSL_KEY_PATH', true, 'file', undefined, value => validator.isLength(value, { min: 1 })),
			new EnvField('SSL_CERT_PATH', true, 'file', undefined, value => validator.isLength(value, { min: 1 })),
			new EnvField('LANGUAGE_FALLBACK', true, 'string', undefined, value => validator.isIn(value, ['en', 'fr'])),
			new EnvField('LOG_LVL', false, 'string', 'info', value =>
				validator.isIn(value, ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
			),
			new EnvField('LOG_DO_CONSOLE', false, 'boolean', 'false'),
		]

		this.fields.forEach(field => {
			this.add(field.name, field.value)
		})
	}

	add(key, value) {
		this[key] = value
	}

	get(key, defaultValue) {
		return this[key] ? this[key] : defaultValue
	}

	getOrFail(key) {
		const value = this.get(key)
		if (value === undefined) {
			throw new Error(`Missing mandatory environment key ${key}`)
		}
		return value
	}
}
