const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// returns number of docs removed
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({ _id: "589fd24f1a2ce9310076bccd" }).then((result) => {
//     console.log(result);
// });

// Todo.findByIdAndRemove("589f9878fd926b00c86c60d3").then((result) => {
//     console.log(result);
// });