const Query = require('./Query')

class QueryTopics extends Query {
	constructor(query, model, user) {
		super(query, model, user)
	} 
	
	populate() {
		this.request.populate([
			{ path: 'program', select: 'title description' },
			{ path: 'user', select: 'name email' }
		])
	}
}

module.exports= QueryTopics