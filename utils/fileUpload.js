const path = require('path'),
	fs = require('fs')


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

/**
 * Create dirrectory /programs/:programId
 * Create dirrectory /programs/:programId/compress
 */
const createProgramDirectories = (programId) => {
	const pathId = pathProgram(programId)
	createDirectory(pathId) 
	createDirectory(path.join(pathId, '/photo')) 
	createDirectory(path.join(pathId, '/photo/compress')) 
}


module.exports = {
	pathProgram,
	createProgramDirectories
}