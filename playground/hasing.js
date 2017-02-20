// const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const password = "qwer1234";
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword = "$2a$10$mkxuIcS.4kuf59pMAsKZYepKxM6KZQvaRzvYdGgM1VLhUcfHR85Zu";

bcrypt.compare(password, hashedPassword, (err, res) => console.log(res));
// const data = {
//   id: 10
// }

// const token = jwt.sign(data, "1234abcd");
// console.log(token);

// const decoded = jwt.verify(token, "1234abcd");

// console.log(decoded);
// const message = "I am a user";
// const hash = SHA256(message).toString();

// console.log(hash);
// console.log(message);

// const data = {
//   id: 4
// }

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// }

// const result = SHA256(JSON.stringify(token.data) + "somesecret").toString();

// if (result === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("Data was changed. Do not trust!");
// }