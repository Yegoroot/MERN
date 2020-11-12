const {queryString, pagination} = require('../utils/query')

/**
 * Если хочешь вывести новое значение из model то присвой ее другой переменной,
 * как сделано на пример total, то есть мы НЕ ДЕЛАЛИ ТАК 	req.total =  await req.requestModel.countDocuments()
 * потому что дальше он все затрет, а после фильтрации получит резельтат от выборки а не от модели
 */
const requestModel = (model, whoWhant) => async (req, res, next) => {

	const queryObj = queryString(req.query)
	
	/**
	 * если получаем пользователей то мы знаем кто обращается, роут защищен
	 */
	let additionalParams = {}
	if (model.collection.collectionName === 'users') {
		if (req.user.role !== 'superadmin') {
			additionalParams = {
				creator: req.user._id
			}
		}
	} else {
		additionalParams = {
			publish: true
		}
	}

	if(model.collection.collectionName === 'programs') {
		if (queryObj.language){
			additionalParams.language = { $in:  JSON.parse(queryObj.language) }
		}
		if (queryObj.level){
			additionalParams.level = { $in:  JSON.parse(queryObj.level) }
		}
	}


	/**
	 * если /my то мы знаем пользователя, роут защищен
	 */
	if (whoWhant === 'my') {
		if ( req.user.role !== 'superadmin' || !queryObj.all) {
			// console.log('not superadmin or not all')
			additionalParams = {
				user: req.user._id
			}
		} 
		delete queryObj.all
		delete additionalParams.publish
	}


	req.requestModel = model.find({...queryObj, ...additionalParams})

	// Select Fileds
	if(req.query.select) {
		const filds = req.query.select.split(',').join(' ')
		req.requestModel = req.requestModel.select(filds) // Стандартная ф-ия mongoose select(param1 param2) with spaces
	}

	// Sort
	if(req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		req.requestModel = req.requestModel.sort(sortBy)
	} else {
		req.requestModel.sort('-createdAt')
	}

	// total documents
	req.total =  await model.countDocuments({...additionalParams})

	// Pagination
	const {index, limit} = pagination(req.query)
	req.requestModel.skip(index).limit(limit)

	return next()
}

module.exports = { requestModel }