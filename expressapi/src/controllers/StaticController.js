export class StaticController {
	constructor() {
		this.root = this.root.bind(this)
	}

	async root(request, response, next) {
		try {
			return response.status(200).json({ message: request.t('page_static_root_hello') })
		} catch (error) {
			return next(error)
		}
	}
}
