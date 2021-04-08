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

## Pagination

```
{{URL}}/api/v1/topics?page=2&limit=2
```

## Validation Errors

In this topic we dont use 3rd part library for validation instead we created **middleware/error**, which include in **server.js** and use in **controller/rewiew.js** (for example)

```js
try {
  // ...
} catch (err) {
  // ...
  next(err);
  // ...
}
```

Also we use the construction allow us directly send message's error without additional logic and conditions. For custom status code and custom message

```js
if (!rewiew) {
  return next(
    new ErrorResponse(`Rewiew not found with of id ${req.params.id}`, 404)
  );
}
```

### mongoose populate()

This this methos which allow one table to load data from another table.
For example in the table Notes has field topic="sadfsdfasdfasdfasdf7897892347ri2uh" which indicate id one of the topic from table Topic. We want to know more information about this topic, not only id

[More about populate() in the official doc](https://mongoosejs.com/docs/tutorials/virtuals.html#populate)

```js
query = Note.find(JSON.parse(queryStr)).populate({
  path: "topic", // link of field 'topic' )
  select: "name description",
});
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
NoteSchema.statics.getAverageFunc = async function (topicId) {
  console.log("Calculating avg");

  const obj = await this.aggregate([
    {
      $match: { topic: topicId },
    },
    {
      $group: {
        _id: "$topic",
        averageField: { $avg: "$fieldNAmeIsHERE" },
      },
    },
  ]);

  console.log(obj);
  try {
    await this.model("Topic").findByIdAndUpdate(topicId, {
      averageField: obj[0].averageField,
    });
  }
};

NoteSchema.post("save", function () {
  this.constructor.getAverageFunc(this.topic); // send id
});
NoteSchema.pre("remove", function () {
  this.constructor.getAverageFunc(this.topic); // send id
});
```

### a little about auth

we use information about user in controlers `req.body.user = req.user.id` And this information (req.user.id) we set in middleware **auth** and call it **protect middleware**
Another words if we have information about user in our controllers we can check them role and so on

We also know that we put in **protect middleware** only several role for others REST API unavalible

### several owner a note

when we create or when update a note with to several topics, then every owner topic become owner this note
// продумать логику, удвлить чужое всегда можно реализовать - не спеши

### difference between static and methods in Model

I dont know excactly but methods calls user itself not model of user itself

## Auth

> Right now we can authorithate with cooike and in headers (Bearer)

## Documentation

делаеться из json файла (postman) и прогоняеться программой Docgen
lesson 69 [https://coursehunter.net/course/node-js-api-master-klass-s-express-i-mongodb](https://coursehunter.net/course/node-js-api-master-klass-s-express-i-mongodb)

## Production

[https://gist.github.com/bradtraversy/cd90d1ed3c462fe3bddd11bf8953a896](https://gist.github.com/bradtraversy/cd90d1ed3c462fe3bddd11bf8953a896)

Rename /config/config.env.env to "/config/config.env"

### install dependencies

```
npm i
```

### run app

```
# dev mode
npm run dev

# production mode
npm start
```

# additional

## Readme из второго курса (этот курс про авторизацию)

```
npm i
gravatar
concurrently // allow run express serve and react dev server in the same time
```

### Создать аватарку

> create before add user, send in User model

```js
const avatar = gravatar.url(email, {
  s: "200",
  r: "pg",
  d: "mm",
});
```

### Profile

> profile havent used yet
> /\_data/profile and models/profile
> In controllers auth/me added

```js
const profile = await profile
  .findOne({ user: req.user.id })
  .populate("user", ["name", "email", "role"]);
```

### Likes

[System of likes in 23 lessons](https://coursehunter.net/course/mern-stack-front-to-back-full-stack-react-redux-node-js)

## GET Programs

- Get all unbublish
  /api/v1/programs

- Get all my
  /api/v1/programs/my

- Get all (only superadmin)
  /api/v1/programs/my?all=true

# Dictionary

Dictionary is category list,

При больщой нагрузки или больших данных лучше разделить на разные категории, то есть запросами обновлять категории по отдельности а не в целом словарь

One dictionary for user

### Защита

`req.user` приходит напрямую из бд (почти), а к пользователю привязан только один словарь
и поэтому это такая защита проверка, на тот случай если кто то попытается не туда не тот словарь или каталог загрузить

```js
// {{URL}}/api/v1/dictionary/categoryId
const categoryId = req.params.id;
const dictionaryId = req.user.dictionary; // привязан к пользователю, п ользователь пришел из БД, то есть это как зазита
const category = await Category.find({
  _id: categoryId,
  dictionary: dictionaryId,
});
```
