const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//create todos
app.post("/todos", (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((data) => {
        res.send(data);
    }, (error) => {
        res.sendStatus(400, error);
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (err) => {
        res.sendStatus(400, err);
    });
});

app.get("/todos/:id", (req, res) => {
    const todoId = req.params.id;

    if (!ObjectId.isValid(todoId)) {
        return res.sendStatus(404);
    }

    Todo.findById(todoId).then((todo) => {
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

    Todo.findByIdAndRemove(todoId).then((todo) => {
        if (!todo) {
            return res.sendStatus(404);
        }

        res.send({ message: `Todo "${todo.text}" removed!` });
    }).catch((err) => res.sendStatus(400));
});

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

module.exports = { app };