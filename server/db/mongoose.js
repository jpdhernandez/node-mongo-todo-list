const mongoose = require("mongoose");
const { mongodbURI } = require("./secret/secret");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || mongodbURI);

module.exports = { mongoose };