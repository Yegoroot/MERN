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

## Filter
```
/api/v1/projects?average[lte]=600
```
- **[lt]** указывает на **меньше**
- **[lte]** указывает на **меньше или равно**
- **[gt]** указывает на **больше**
- **[gte]** указывает на **больше или равно**

