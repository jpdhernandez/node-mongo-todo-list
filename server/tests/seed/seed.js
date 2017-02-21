const Promise = require("bluebird");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const todos = [{
  _id: new ObjectId(),
  text: "First todo"
}, {
  _id: new ObjectId(),
  text: "Second todo",
  completed: false,
  completedAt: 170212
}];

// Drop data and add seed data
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

const testUserOneId = new ObjectId();
const testUserTwoId = new ObjectId();
const users = [{
  _id: testUserOneId,
  email: "julian@example.com",
  password: "testUserPass",
  tokens: [{
    access: "auth",
    token: jwt.sign({ _id: testUserOneId, access: "auth" }, "secret").toString()
  }]
}, {
  _id: testUserTwoId,
  email: "philip@example.com",
  password: "testUserPass"
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // since we have middleware for the User model, we can't use insertMany
    const testUserOne = new User(users[0]).save();
    const testUserTwo = new User(users[1]).save();

    return Promise.all([testUserOne, testUserTwo])
  }).then(() => done());
};


module.exports = { todos, populateTodos, users, populateUsers };