// const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
/**
 * этот модуль можно сделать расширяемым, например для загрузки других файлоы
 * но для этого необходимо сделать чтоб эта ф-ия возвращала ф-ию 
 * и тогда передать в нее fileUpload('image') или fileUpload('file') 
 */

exports.fileUpload = function (req, res, next) {

	if(!req.files || !req.files.photo) {
		req.body.photo = null
		return next()
	}
  
	const file  = req.files.photo

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return	next(new ErrorResponse('Please upload an image file', 400))
	}

	// Check filesize
	if(file.size > process.env.MAX_FILE_UPLOAD) {
		return	next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
	}

	// upload file
	file.mv(`${process.env.IMAGES_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err)
			return	next(new ErrorResponse('Problem with file upload', 500))
		}
		req.body.photo = file.name
		return next()
	})
}
