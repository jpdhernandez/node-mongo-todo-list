const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");

// Seed data for the test
const todos = [{
    _id: new ObjectId(),
    text: "First todo"
}, {
    _id: new ObjectId(),
    text: "Second todo",
    completed: false,
    completedAt: 170212
}];

// Drop data and add seed data
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        const text = "Test todo";

        request(app)
            .post("/todos")
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().where("text").equals("Test todo")
                    .then((todo) => {
                        expect(todo[0].text).toBe(text);
                        done();
                    }).catch((e) => done(e));
            });
    });

    it("should create a 2 todos", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({})
                    .then((todo) => {
                        expect(todo.length).toBe(2);
                        done();
                    }).catch((e) => done(e));
            });
    });
});

describe("GET /todos", () => {
    it("should get all todos in the db", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should get a todo with id supplied", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it("should return a 404 if todo to GET not found", (done) => {
        const hexId = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404).end(done);
    });

    it("should return a 404 if todo to GET is a non-ObjectId", (done) => {
        const invalidId = "12afdfh345"
        request(app)
            .get(`/todos/${invalidId}`)
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo with id supplied", (done) => {
        request(app)
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[1]._id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it("should return a 404 if todo to delete is not found", (done) => {
        const hexId = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404).end(done);
    });

    it("should return a 404 if todo to delete is a non-ObjectId", (done) => {
        const invalidId = "12afdfh345"
        request(app)
            .delete(`/todos/${invalidId}`)
            .expect(404)
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {
    it("should update a todo with id supplied", (done) => {
        const newText = "Updated text";

        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({ text: newText, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
            }).end(done)
    });

    it("should clear completedAt when todo is not completed", (done) => {
        const newText = "Yet another updated text";
        const newCompleted = false;

        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({ text: newText, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            }).end(done);
    });
});