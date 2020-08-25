const {queryString, pagination} = require('../utils/query')

/**
 * Если хочешь вывести новое значение из model то присвой ее другой переменной,
 * как сделано на пример total, то есть мы НЕ ДЕЛАЛИ ТАК 	req.total =  await req.requestModel.countDocuments()
 * потому что дальше он все затрет, а после фильтрации получит резельтат от выборки а не от модели
 */
const requestModel = model => async (req, res, next) => {

	const queryObj = queryString(req.query)
	req.requestModel = model.find({...queryObj, publish: true})

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
	req.total =  await model.countDocuments({publish: true})

	// Pagination
	const {index, limit} = pagination(req.query)
	req.requestModel.skip(index).limit(limit)

	next()
}

module.exports = { requestModel }