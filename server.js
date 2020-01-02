const http = require("http");

let todos = [
  { id: 1, date: "text 1" },
  { id: 2, date: "text 2" },
  { id: 3, date: "text 3" }
];

const server = http.createServer((req, res) => {
  res.writeHead(404, {
    "Content-Type": "application/json",
    "X-Powered-By": "Node.js"
  });

  console.log(req.headers.authorization);

  res.end(
    JSON.stringify({
      success: false,
      error: "Not Found",
      data: null
    })
  );
});

const PORT = 5000;

server.listen(PORT, () => console.log(`server runnig on potrt ${PORT}`));
