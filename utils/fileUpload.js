import path, { dirname } from 'path'
import fs from 'fs'
import rimraf from 'rimraf'
import { fileURLToPath } from 'url'
import imageminWebp from 'imagemin-webp'
import imagemin  from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminMozjpeg from 'imagemin-mozjpeg'

const __dirname = dirname(fileURLToPath(import.meta.url))


export const convertCompress = async (from, to) => {

  rimraf.sync(path.join(__dirname, '../', to, '/*')) // delete all from /compress

  const convertToWebp = async () =>
		await imagemin([from], {
			destination: to,
			plugins: [
				imageminWebp({quality: 75 })
			]
		}).then(()=>'okey')

  return await imagemin([from], {
    destination: to,
    plugins: [
      imageminMozjpeg({	quality: 70 }),
			imageminPngquant({ quality: [0.6, 0.8] }),
    ],
  })
    .then(await convertToWebp())
    .catch((e) => { console.log('errrorrr'.red, e); return 'erorrchik' })
}



  // когда все площадки будут поддерживать норм webp то можено будет только его использовать
  // https://css-tricks.com/using-webp-images/ 
  // https://caniuse.com/webp
  // export const convertCompress = async (from, to) => {
  // rimraf.sync(path.join(__dirname, '../', to, '/*')) // delete all from /compress
  // return await imagemin([from], {
  //   destination: to,
  //   plugins: [
  //     imageminWebp({quality: 75 })
  //   ],
  // })
  //   .then(()=>'okey')
  //   .catch((e) => { console.log('errrorrr'.red, e); return 'erorrchik' })
  // }




// DELETE COMPRESS FOLDER (if update)


// define program dirictory by programId
export const pathProgram = (programId) => path.join(__dirname, '../public/uploads/programs/', programId)


//  create directory if not exist
export const createDirectory = (pathId) => {
  const isExist = fs.existsSync(pathId)
  if (!isExist) {
    fs.mkdirSync(pathId, { recursive: true })
  }
  // console.log('222 or 444' )
}

export const createRecordDirectory = ({
  programId, topicId, recordId, withoutCompress,
}) => {
  // console.log('111')
  const pathId = pathProgram(programId)
  createDirectory(path.join(pathId, `/topics/${topicId}/contents/${recordId}`))
  // console.log('333')
  if (!withoutCompress) {
    createDirectory(path.join(pathId, `/topics/${topicId}/contents/${recordId}/compress`))
  }
}

/**
 * Create dirrectory /programs/:programId
 * Create dirrectory /programs/:programId/compress
 */
export const createProgramPhotoDirectories = (programId) => {
  const pathId = pathProgram(programId)
  createDirectory(pathId)
  createDirectory(path.join(pathId, '/photo'))
  createDirectory(path.join(pathId, '/photo/compress'))
}
