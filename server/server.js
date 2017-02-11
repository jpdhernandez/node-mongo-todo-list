const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const app = express();

app.use(bodyParser.json());

//create todos
app.post("/todos", (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((data) => {
        res.send(data);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get("/todos/:id", (req, res) => {
    const todoId = req.params.id;

    if (!ObjectId.isValid(todoId)) {
        res.status(404).send();
    }

    Todo.findById(todoId).then((todo) => {
        if (!todo) {
            res.send(404).send();
        }
        res.send({ todo });
    }).catch((err) => res.status(400).send());
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = { app };