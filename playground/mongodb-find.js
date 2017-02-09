const { MongoClient, ObjectId } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todo_app", (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongDB server");
    }
    console.log("Connected to MongoDB server");

    db.collection("todos").find({ completed: false }).toArray()
        .then((docs) => {
            console.log("todos");
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log("Unable to fetch todos", err);
        });

    // db.collection("todos").find({ _id: ObjectId("589c329b8af28422047c6ab1") }).toArray()
    //     .then((docs) => {
    //         console.log("todos");
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log("Unable to fetch todos", err);
    //     });

    // db.collection("todos").find().count()
    //     .then((count) => {
    //         console.log(`Todos count: ${count}`);
    //     }, (err) => {
    //         console.log("Unable to fetch todos", err);
    //     })

    // db.collection("users").find({ name: "Julian" }).count()
    //     .then((count) => {
    //         console.log(`Users count: ${count}`);
    //     }, (err) => {
    //         console.log("Unable to fetch users", err);
    //     });

    // db.collection("users").find({ name: "Julian" }).toArray()
    //     .then((docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log("Unable to fetch users", err);
    //     });
    // db.close();
});