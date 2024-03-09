import https from 'https'
import app from '@/app'
import container from '@/container'

const env = container.resolve('Environment')
const port = env.getOrFail('SERVER_PORT')

app.set('port', port)
const server = https.createServer(
	{
		key: env.getOrFail('SSL_KEY_PATH'),
		cert: env.getOrFail('SSL_CERT_PATH'),
	},
	app
)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`, true)
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`, true)
			process.exit(1)
			break
		default:
			console.error(`${error}`, true)
			throw error
	}
}

function onListening() {
	console.log(`Server is running at https://${process.env.SERVER_SUBDOMAIN}:${process.env.SERVER_PORT}`, true)
}
