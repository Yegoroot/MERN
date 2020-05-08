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
  s: '200',
  r: 'pg',
  d: 'mm'
})
```

### Profile
> profile havent used yet
> /_data/profile and models/profile
In controllers auth/me added 
```js
const profile = await profile.findOne({user: req.user.id}).populate('user', ['name', 'email', 'role'])
```

### Likes
[System of likes in 23 lessons](https://coursehunter.net/course/mern-stack-front-to-back-full-stack-react-redux-node-js)
