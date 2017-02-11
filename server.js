const mongoose = require("mongoose");
const Todo = require("./models/todo");
const User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/todo_app");

// const newTodo = new Todo({
//     text: "Practice more Angular"
// });

// newTodo.save().then((doc) => {
//     console.log("Saved todo", doc);
// }, (err) => {
//     console.log("Unable to save todo");
// })

// const anotherTodo = new Todo({
//     text: "Create server.js",
//     completed: true,
//     completedAt: Date.now()
// });

// anotherTodo.save().then((doc) => {
//     console.log("Saved todo", doc);
// }, (err) => {
//     console.log("Unable to save todo");
// })

const user = new User({
    email: "test@test.com",
    password: 1234
});

user.save().then((doc) => {
    console.log("Save user", doc)
}, (err) => {
    console.log("unable to save user");
});