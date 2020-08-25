/** Формируем новую строку запроса
 * - Исключаем некоторые поля (потому что их используем по другому, в другом месте)
 * - Преобразуем gt|gte|lt|lte|in => $gt|$gte|$lt|...
 */
exports.queryString = (query) => {
	const {select, sort, page, limit, ...newQuery} = query
  
	let queryStr = JSON.stringify(newQuery)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	return JSON.parse(queryStr)
}

/** Pagination 
 *  Выводит количество страниц и лимит документов
 */
exports.pagination = (reqQuery) => {
	const page = parseInt(reqQuery.page, 10) || 0
	const limit = parseInt(reqQuery.limit, 10) || 25
	const index = page * limit

	return {
		index,
		limit
	}
}

// exports.checkPublishStatus =  (req, model) => new  Promise ( (resolve, reject) => {
// 	setTimeout(() => {
// 		console.log('before')
// 		resolve()
// 	}, 10000)
// }) 
	
