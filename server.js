const http = require("http");

let todos = [
  { id: 1, date: "text 1" },
  { id: 2, date: "text 2" },
  { id: 3, date: "text 3" }
];

const server = http.createServer((req, res) => {
  res.setHeader("X-Powered-By", "Node.js");
  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      success: true,
      data: todos
    })
  );
});

const PORT = 5000;

server.listen(PORT, () => console.log(`server runnig on potrt ${PORT}`));
