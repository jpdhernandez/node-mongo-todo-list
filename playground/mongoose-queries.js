const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// const _id = "689fd53cf109de31ddc47d0b6";
// if (!ObjectId.isValid(_id)) {
//     console.log("Id not valid");
// }

// returns an array 
// Todo.find({ _id })
//     .then((todos) => {
//         console.log("Todos", todos);
//     });

// // if empty, returns null
// Todo.findOne({ _id })
//     .then((todos) => {
//         console.log("Todo", todos);
//     });

// Todo.findById(_id)
//     .then((todos) => {
//         console.log("Todo by Id", todos);
//     });

// Todo.findById(_id)
//     .then((todos) => {
//         if (!todos) {
//             console.log(`Id: ${_id} not found`);
//         }
//         console.log("Todo by Id", todos);
//     }).catch((e) => console.log(e));

const userId = "589c4d7268f12ee95a700f4e";

User.findById(userId)
    .then((user) => {
        if (!user) {
            return console.error("User does not exist!");
        }
        console.log(JSON.stringify(user, undefined, 2));
    })