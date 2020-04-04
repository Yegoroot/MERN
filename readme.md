## Structure The topic
First of all in the general this is topic for **topic**. Topic to lear Arabic, had been decided to expand the topic with areas such as **English** and **computer science** 

Topic -> A lot of notes -> A lot of materials

## Filter
```
/api/v1/topics?photo=no-photo.jpg
/api/v1/topics?average[lte]=600
```
- **[lt]** указывает на **меньше**
- **[lte]** указывает на **меньше или равно**
- **[gt]** указывает на **больше**
- **[gte]** указывает на **больше или равно**

## Select and Sort
In this case we can **select fileds** which we want
```
/api/v1/topics?select=name,description
```
By default **-createdAt**
```
/api/v1/topics?sort=name
/api/v1/topics?sort=-name
```

## Validation Errors
In this topic we dont use 3rd part library for validation instead we created **middleware/error**, which include in **server.js** and use in **controller/rewiew.js** (for example) 
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
if (!rewiew) {
    return	next(new ErrorResponse(`Rewiew not found with of id ${req.params.id}`, 404))
}
```

### mongoose populate()
This this methos which allow one table to load data from another table.
For example in the table Notes has field topic="sadfsdfasdfasdfasdf7897892347ri2uh" which indicate id one of the topic from table Topic. We want to know more information about this topic, not only id

[More about populate() in the official doc](https://mongoosejs.com/docs/tutorials/virtuals.html#populate)

```js
query = Note.find(JSON.parse(queryStr)).populate({
    path: 'topic', // link of field 'topic' )
    select: 'name description'
})
```

```js
// * this in the model Note 
topic: { // into here load data from table Topic* 
    type: mongoose.Schema.ObjectId,
    ref: 'Topic',
    required: true
},
```

### virtuale() 

### static
Есть у монгоДБ возможность вычисления среднего показания по записям в бд, при удалении или добавлении соответсвенно пересчитывается https://coursehunter.net/course/node-js-api-master-klass-s-express-i-mongodb в уроке 41
то есть для родительсякого документа можно вычитать среднее по дочерним и при изминении дочерних пересчитывать в родтеле

```js
// model

// static method to get avg of smt of note
NoteSchema.statics.getAverageFunc = async function(topicId) {
    console.log('Calculating avg')

    const obj = await this.aggregate([
        {
            $match: { topic: topicId }
        },
        {
            $group: {
                _id: '$topic',
                averageField: { $avg: '$fieldNAmeIsHERE' }
            }
        }
    ])

    console.log(obj)
    try {
        await this.model('Topic').findByIdAndUpdate(topicId, {
            averageField: obj[0].averageField
        })
    }
}


NoteSchema.post('save', function() {
    this.constructor.getAverageFunc(this.topic) // send id
})
NoteSchema.pre('remove', function() {
    this.constructor.getAverageFunc(this.topic) // send id
})
```


### a little about auth
we use information about user in controlers ```req.body.user = req.user.id``` And this information (req.user.id) we set in middleware **auth** and call it __protect middleware__
Another words if we have information about user in our controllers we can check them role and so on

We also know that we put in __protect middleware__ only several role for others REST API unavalible

### several owner a note
when we create or when update a note with to several topics, then every owner topic become owner this note
// продумать логику, удвлить чужое всегда можно реализовать - не спеши

### difference between static and methods in Model
I dont know excactly but methods calls user itself not model of user itself