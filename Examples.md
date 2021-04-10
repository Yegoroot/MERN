# Документы вложенны в документ

```js
const Category = new mongoose.Schema({
  title: String,
  words: [
    {
      title: String,
      content: String,
    },
  ],
});
mongoose.model("Category", Category, "Category");

// Dictionary
const DictionarySchema = new mongoose.Schema({
  categories: [
    {
      type: [Object],
      ref: "Category",
    },
  ],
  user: {
    unique: true, // ony for one
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
```

# Populate of populate

```js
//
export const populateDictionary = {
  path: "dictionary",
  populate: {
    path: "categories",
    select: "categories title -dictionary",
  },
};
// for create
let data = await User.create(values);
data = await data.populate(populateDictionary).execPopulate();

// for get
await User.find({ user }).populate(populateDictionary);
```
