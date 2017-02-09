const { MongoClient, ObjectId } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todo_app", (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongDB server");
    }
    console.log("Connected to MongoDB server");

    // db.collection("todos").findOneAndUpdate({
    //         _id: new ObjectId("589c4a4d68f12ee95a700ec9")
    //     }, {
    //         // update operation
    //         $set: {
    //             completed: false
    //         }
    //     }, {
    //         returnOriginal: false
    //     })
    //     .then((results) => {
    //         console.log(results);
    //     })

    db.collection("users").findOneAndUpdate({
            _id: new ObjectId("589c4d7268f12ee95a700f4e")
        }, {
            $set: {
                name: "Julian",
                location: "Vancouver"
            },
            $inc: {
                age: 40
            },
            $mul: {
                salary: 1.20
            }
        }, {
            returnOriginal: false
        })
        .then((results) => {
            console.log(results);
        })

    // db.close();
});