const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        default: false,
        require: true
    },
    joined: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model("users", TodoSchema);

module.exports = { User };