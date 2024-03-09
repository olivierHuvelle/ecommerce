import container from '@/container'

const env = container.resolve('Environment')

export default {
	windowMs: env.getOrFail('WINDOW_DURATION_IN_MS'),
	max: env.getOrFail('WINDOW_NB_REQUEST'),
	message: 'configuration_rateLimiter_message',
	standardHeaders: true,
	legacyHeaders: false,
}
