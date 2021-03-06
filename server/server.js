require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

// TODO: Refactor and modularize; create routes and controller file.

app.post("/todos", authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save()
    .then((data) => {
      res.send(data);
    }).catch((err) => res.sendStatus(400, err));
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
      _creator: req.user._id
    })
    .then((todos) => {
      res.send({ todos })
    }).catch((err) => res.sendStatus(400, err));
});

app.get("/todos/:id", authenticate, (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) {
    return res.sendStatus(404);
  }

  Todo.findOne({
      _id: todoId,
      _creator: req.user._id
    })
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }
      res.send({ todo });
    }).catch((err) => res.sendStatus(400));
});

app.delete("/todos/:id", authenticate, (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) {
    return res.sendStatus(404);
  }

  Todo.findOneAndRemove({
      _id: todoId,
      _creator: req.user._id
    })
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }

      res.send({ todo });
    }).catch((err) => res.sendStatus(400));
});

app.patch("/todos/:id", authenticate, (req, res) => {
  const todoId = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectId.isValid(todoId)) {
    return res.sendStatus(404);
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
      _id: todoId,
      _creator: req.user._id
    }, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }

      res.send({ todo });
    }).catch((err) => res.sendStatus(400, err));
});

app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  const user = new User(body);

  user.save()
    .then(() => user.generateAuthToken())
    .then((token) => {
      res.header("x-auth", token)
        .send(user.toJSON());
    }).catch((err) => res.sendStatus(400, err.message));
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header("x-auth", token)
            .send(user.toJSON());
        })
    }).catch((err) => res.sendStatus(400, err));
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => res.status(200).send(), () => res.sendStatus(400));
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

module.exports = { app };