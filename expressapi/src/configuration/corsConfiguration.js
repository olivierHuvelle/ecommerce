import container from '@/container'
const env = container.resolve('Environment')

export default {
	origin: env.getOrFail('CORS_ALLOWED_ORIGIN'),
	optionsSuccessStatus: 200,
	allowedHeaders: ['Content-Type', 'Authorization', 'RefreshToken', 'Accept-Language'],
}
