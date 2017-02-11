const mongoose = require("mongoose");
const { mongodbURI } = require("./secret/secret");
mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI || "mongodb://localhost:27017/todo_app");

module.exports = {
    mongoose
}