const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        runValidators: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

const Todo = mongoose.model("todos", TodoSchema);

module.exports = { Todo };