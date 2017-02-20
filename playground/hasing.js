const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

const data = {
  id: 10
}

const token = jwt.sign(data, "1234abcd");
console.log(token);

const decoded = jwt.verify(token, "1234abcd");
console.log(decoded);
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