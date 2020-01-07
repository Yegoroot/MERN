## Validation Errors
In this project we dont use 3rd part library for validation instead we created **middleware/error**, which include in **server.js** and use in **controller/note.js** (for example) 
```js
try {
    // ...
}
catch(err) {
    // ...
    next(err)
    // ...
} 
```
Also we use the construction allow us directly send message's error without additional logic and conditions. For custom status code and custom message
```js
if (!note) {
    return	next(new ErrorResponse(`Note not found with of id ${req.params.id}`, 404))
}
```