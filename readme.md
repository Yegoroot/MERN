## Structure The project
First of all in the general this is project for **project**. Project to lear Arabic, had been decided to expand the project with areas such as **English** and **computer science** 

Project -> A lot of categories -> A lot of materials

## Filter
```
/api/v1/projects?average[lte]=600
```
- **[lt]** указывает на **меньше**
- **[lte]** указывает на **меньше или равно**
- **[gt]** указывает на **больше**
- **[gte]** указывает на **больше или равно**

## Select and Sort
In this case we can **select fileds** which we want
```
/api/v1/projects?select=name,description
```
By default **-createdAt**
```
/api/v1/projects?sort=name
/api/v1/projects?sort=-name
```

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

### mongoose populate()
This this methos which allow one table to load data from another table.
For example in the table Categories has field project="sadfsdfasdfasdfasdf7897892347ri2uh" which indicate id one of the project from table Project. We want to know more information about this project, not only id

[More about populate() in the official doc](https://mongoosejs.com/docs/tutorials/virtuals.html#populate)

```js
query = Category.find(JSON.parse(queryStr)).populate({
    path: 'project', // link of field 'project' )
    select: 'name description'
})
```

```js
// * this in the model Category 
project: { // into here load data from table Project* 
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
},
```

### virtuale() 