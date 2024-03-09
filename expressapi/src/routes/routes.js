import { Router } from 'express'
import { StaticController } from '@/controllers/StaticController'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../swagger.json'

const router = Router()
router.get('/', new StaticController().root)

router.use('/docs', swaggerUi.serve)
router.get('/docs', swaggerUi.setup(swaggerDocument))

export default router
