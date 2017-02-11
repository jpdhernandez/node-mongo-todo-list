const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { Todo } = require("../models/todo");

// Seed data for the test
const todos = [{
    text: "First todo"
}, {
    text: "Second todo"
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
            .expect(400)
            .expect((res) => {
                expect(res.body.name).toEqual("ValidationError");
            })
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