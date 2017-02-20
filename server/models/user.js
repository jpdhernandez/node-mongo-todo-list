const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Promise = require("bluebird");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
    }],
  joined: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = "auth";

  const token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, "secret").toString();

  user.tokens.push({ access, token });

  return user.save().then((data) => token);
};

// Asymmetric way returns does not work... it doesn't authenticate
// UserSchema.statics.findByToken = function(token) {
//   const User = this;

//   return Promise.resolve(jwt.verify(token, "secret"))
//     .then((err, decoded) => {
//       if (err) {
//         return Promise.reject();
//       }

//       return User.findOne({
//         "_id": decoded._id,
//         "tokens.token": token,
//         "tokens.access": "auth"
//       });
//     });
// };

// Statics creates a Model method instead of an instance
UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, "secret");
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

const User = mongoose.model("users", UserSchema);

module.exports = { User };