const expect = require("expect");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");
const { User } = require("../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

// Drop data and add seed data
beforeEach(populateUsers);
beforeEach(populateTodos);

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
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should get a todo with id supplied", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
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
      })
      .end(done);
  });
});

describe("GET users/me", () => {
  it("should return a user if autheticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
})

describe("POST /users", () => {
  it("should create a user", (done) => {
    const email = "test@test.com";
    const password = "testPassword";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then((user) => {
            expect(user).toExist();
            expect(user.password).toNotEqual(password);
            done();
          }).catch((err) => done(err));
      });
  });

  it("should return validation errors if request invalid", (done) => {
    const invalidEmail = "test#test.com";
    const password = "testPassword";

    request(app)
      .post("/users")
      .send({ invalidEmail, password })
      .expect(400)
      .expect((err) => {
        expect(err.text).toContain("Bad Request");
      })
      .end(done);
  });

  it("should not create a user if email is in use", (done) => {
    const emailInUse = users[0].email;
    const testPassword = "testPassword";

    request(app)
      .post("/users")
      .send({ emailInUse, testPassword })
      .expect(400)
      .end(done);
  })
});

describe("POST /users/login", () => {
  it("should login user and return auth token", (done) => {
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(users[1].email);
        expect(res.body._id).toExist();
        expect(res.headers["x-auth"]).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email: users[1].email })
          .then((user) => {
            expect(user.tokens[0]).toInclude({
              access: "auth",
              token: res.headers["x-auth"]
            });
            expect(user.password).toNotEqual(users[1].password);
            done();
          }).catch((err) => done(err));
      });
  });

  it("should reject invalid login", (done) => {
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: "wrongPass" })
      .expect(400)
      .expect((res) => {
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({ email: users[1].email })
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((err) => done(err));
      });
  });
});