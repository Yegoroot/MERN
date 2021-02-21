/* eslint-disable no-console */

class Query {
	constructor(query, model, user) {
		this.query = query
		this.user = user
		this.model = model
		this.mongoQuery = this.modifyQuery() // delete fields "select", "sort", "page", "limit"
		this.request = null
	}

	// специальная заглушка, потому что этого метода нет в users
	populate() { 	return	}

	filter() {
		return this.user.role === 'superadmin' 
			? {} // никакого фильтра
			: {
				// все опубликованные и собсвтеннику можно
				$or: [ { publish: true }, { user: this.user._id }]
			}
	}

	modifyQuery() {
		const {select, sort, page, limit, ...newQuery} = this.query
		let queryStr = JSON.stringify(newQuery)
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)	
		return JSON.parse(queryStr)
	}
	
	pagination() {
		const page = parseInt(this.query.page, 10) || 0
		const limit = parseInt(this.query.limit, 10) || 25
		const index = page * limit
		// METHOD MONGO
		this.request.skip(index).limit(limit) 
	}
	
	sort() {
		if(this.query.sort) {
			const sortBy = this.query.sort.split(',').join(' ')
			this.request.sort(sortBy)
		} else {
			this.request.sort('-createdAt')
		}
	}
	
	select(){
		if(this.query.select) {
			const filds = this.query.select.split(',').join(' ')
			this.request.select(filds) // Стандартная ф-ия mongoose select(param1 param2) with spaces
		}
	}

	async getData () {
		return await this.request
	}

	async getTotal() {
		return await this.request.countDocuments({...this.mongoQuery, ...this.filter()})
	}
	
	info() {
		console.log(this.mongoQuery)
		console.log(this.query)
		console.log(`'collection is Here - ', ${this.request.mongooseCollection.name}`.blue)
	}

		
	sendRequest() {
		const filter = this.filter()
		this.request =  this.model.find({...this.mongoQuery, ...filter})
		this.select()
		this.populate()
		this.sort()
		this.pagination()
	}

}

module.exports= Query