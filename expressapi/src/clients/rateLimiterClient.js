import rateLimit from 'express-rate-limit'
import rateLimiterConfiguration from '@/configuration/rateLimiterConfiguration'

export default rateLimit(rateLimiterConfiguration)
