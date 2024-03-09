import path from 'path'
import express from 'express'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'
import backend from 'i18next-fs-backend'
import helmet from 'helmet'
import createError from 'http-errors'
import corsClient from '@/clients/corsClient'
import rateLimiterClient from '@/clients/rateLimiterClient'
import router from '@/routes/routes'
import container from '@/container'
import { PathUtils } from '@/utils/PathUtils'
import { logger } from '@/clients/loggerClient'

i18next
	.use(backend)
	.use(middleware.LanguageDetector)
	.init({
		fallbackLng: container.resolve('Environment').getOrFail('LANGUAGE_FALLBACK'),
		backend: {
			loadPath: path.join(PathUtils.getSrcPath(), '../locales/{{lng}}/translation.json'),
		},
	})

const app = express()

app.disable('x-powered-by')
app.use(middleware.handle(i18next))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(corsClient)
app.use(rateLimiterClient)
app.use(router)

// 404 handler
app.use((request, response, next) => {
	next(createError(404, request.t('page_404')))
})

// general error handler
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
	logger.log('error', 'some error message')
	const errorMessage = container.resolve('Environment').environment === 'PROD' ? request.t('page_500') : error
	return response.status(error.status || 500).json(errorMessage)
})

export default app
