const Query = require('./QueryMain')

class QueryPrograms extends Query {
	constructor(query, model, user) {
		super(query, model, user)
		// Приходят в непонятном виде
		if (this.query.language){
			this.mongoQuery.language = { $in:  JSON.parse(this.query.language) }
		}
		if (this.query.level){
			this.mongoQuery.level = { $in: JSON.parse(this.query.level) }
		}
	} 
	
	populate() {
		this.request.populate([
			{ path: 'topics', select: 'title description photo -program' },
			{ path: 'user', select: 'name email' },
			{ path: 'types', select: 'title alias color' }
		])
	}
}

module.exports= QueryPrograms