const path = require('path')
const	fs = require('fs')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminWebp = require('imagemin-webp')
const rimraf = require('rimraf')

const convertCompress = async (from, to) => {
	// DELETE COMPRESS FOLDER (if update)
	rimraf.sync(path.join(__dirname, '../', to, '/*'))

	// CONVERT
	const convertToWebp = async () =>
		await imagemin([from], {
			destination: to,
			plugins: [
				imageminWebp({quality: 75 })
			]
		})
		// COMPRESS PHOTO 
	await imagemin([from], {
		destination: to,
		plugins: [
			imageminMozjpeg({	quality: 70 }),
			imageminPngquant({ quality: [0.6, 0.8] })
		]
	}
	)
		.then(async () => {await convertToWebp()})	 
}


/**
 * define program dirictory by programId
 * eslint-disable-next-line no-undef
 */
const pathProgram = (programId) => path.join(__dirname, '../public/uploads/programs/', programId)


/**
 * create directory if not exist
 */
const createDirectory = (pathId) => {
	let isExist = fs.existsSync(pathId) 
	if (!isExist) {
		fs.mkdirSync(pathId, {recursive: true})
	}
}

const createRecordDirectory = ({programId, topicId, recordId, withoutCompress}) => {
	const pathId = pathProgram(programId)
	createDirectory(path.join(pathId, `/topics/${topicId}/contents/${recordId}`)) 
	if (!withoutCompress) {
		createDirectory(path.join(pathId, `/topics/${topicId}/contents/${recordId}/compress`)) 
	}
}

/**
 * Create dirrectory /programs/:programId
 * Create dirrectory /programs/:programId/compress
 */
const createProgramPhotoDirectories = (programId) => {
	const pathId = pathProgram(programId)
	createDirectory(pathId) 
	createDirectory(path.join(pathId, '/photo')) 
	createDirectory(path.join(pathId, '/photo/compress')) 
}


module.exports = {
	pathProgram,
	createDirectory,
	convertCompress,
	createProgramPhotoDirectories,
	createRecordDirectory
}