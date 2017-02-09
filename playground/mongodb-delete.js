const { MongoClient, ObjectId } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todo_app", (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongDB server");
    }
    console.log("Connected to MongoDB server");

    // db.collection("todos").deleteMany({ text: "Something to do" })
    //     .then((result) => console.log(result));

    // db.collection("todos").deleteOne({ text: "Something to do" })
    //     .then((result) => console.log(result));

    // note: "complete": false without the "" does not work
    // db.collection("todos").findOneAndDelete({ "completed": false })
    //     .then((result) => console.log(result));

    // db.collection("users").deleteMany({ name: "Julian" })
    //     .then((results) => console.log(results));

    // db.collection("users").deleteOne({ name: "Julian" })
    //     .then((results) => console.log(results));

    // db.collection("users").findOneAndDelete({ _id: new ObjectId("589c33b73c8e3520f4654837") })
    //     .then((results) => console.log(results));

    // db.close();
});