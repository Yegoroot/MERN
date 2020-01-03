const http = require('http')

let todos = [
	{ id: 1, date: 'text 1' },
	{ id: 2, date: 'text 2' },
	{ id: 3, date: 'text 3' }
]

const server = http.createServer((req, res) => {
	const { method, url } = req
	let body = []

	req
		.on('data', chunk => {
			body.push(chunk)
		})
		.on('end', () => {
			body = Buffer.concat(body).toString()

			// по умолчанию
			let status = 404
			const response = {
				success: false,
				data: null
			}

			if (method === 'GET' && url === '/todos') {
				status = 200
				response.success = true
				response.data = todos
			}

			res.writeHead(status, {
				'Content-Type': 'application/json',
				'X-Powered-By': 'Node.js'
			})
			res.end(JSON.stringify(response))
		})

	console.log(req.headers.authorization)
})

const PORT = 5000

server.listen(PORT, () => console.log(`server runnig on potrt ${PORT}`))
