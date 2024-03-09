import { createContainer, asClass, InjectionMode, asValue } from 'awilix'
import { Dotenv, ENVIRONMENTS } from '@/configuration/Dotenv'
import { Environment } from '@/configuration/Environment'

const container = createContainer({
	injectionMode: InjectionMode.CLASSIC,
	strict: true,
})

container.register({
	ENVIRONMENTS: asValue(ENVIRONMENTS),
	Dotenv: asClass(Dotenv).singleton(),
	Environment: asClass(Environment).singleton(),
})

export default container
