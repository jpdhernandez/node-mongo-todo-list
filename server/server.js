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

app.post("/todos", (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((data) => {
      res.send(data);
    }).catch((err) => res.sendStatus(400, err));
});

app.get("/todos", (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({ todos })
    }).catch((err) => res.sendStatus(400, err));
});

app.get("/todos/:id", (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) {
    return res.sendStatus(404);
  }

  Todo.findById(todoId)
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }
      res.send({ todo });
    }).catch((err) => res.sendStatus(400));
});

app.delete("/todos/:id", (req, res) => {
  const todoId = req.params.id;

  if (!ObjectId.isValid(todoId)) {
    return res.sendStatus(404);
  }

  Todo.findByIdAndRemove(todoId)
    .then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }

      res.send({ todo });
    }).catch((err) => res.sendStatus(400));
});

app.patch("/todos/:id", (req, res) => {
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

  Todo.findByIdAndUpdate(todoId, { $set: body }, { new: true })
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

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

module.exports = { app };