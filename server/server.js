const express = require("express");
const bodyParser = require("body-parser");

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

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = { app };