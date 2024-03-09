import { describe, it, beforeEach, afterEach } from 'mocha'
import chaiHttp from 'chai-http'
import chai from 'chai'
import i18next from 'i18next'
import app from '@/app'

chai.should()
chai.use(chaiHttp)

describe('static tests', function () {
	let request

	beforeEach(async function () {
		request = {
			t: i18next.t.bind(i18next),
		}
	})

	afterEach(async function () {
		request = undefined
	})

	it('root page', async function () {
		const response = await chai.request(app).get('/')
		response.should.have.status(200)
		response.body.should.eql({ message: request.t('page_static_root_hello') })
	})

	it('404 page', async function () {
		const response = await chai.request(app).get('/inexisting')
		response.should.have.status(404)
		response.body.should.eql({ message: request.t('page_404') })
	})
})
