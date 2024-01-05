const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Username must be unique.");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

describe("POST /api/users", () => {
  test("rejects invalid user creation without username", async () => {
    const newUser = {
      // Missing username
      name: "John Doe",
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain(
      "Both username and password must be provided."
    );
  });

  test("rejects invalid user creation without password", async () => {
    const newUser = {
      username: "john",
      // Missing password
      name: "John Doe",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain(
      "Both username and password must be provided."
    );
  });

  test("rejects invalid user creation with short username", async () => {
    const newUser = {
      username: "ab", // Short username
      name: "John Doe",
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain(
      "Both username and password must be at least 3 characters long."
    );
  });

  test("rejects invalid user creation with short password", async () => {
    const newUser = {
      username: "john",
      name: "John Doe",
      password: "pw", // Short password
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain(
      "Both username and password must be at least 3 characters long."
    );
  });

  test("rejects invalid user creation with non-unique username", async () => {
    // Create an initial user with the same username
    await User.create({
      username: "john",
      name: "John Doe",
      passwordHash: "hashedpassword",
    });

    const newUser = {
      username: "john", // Non-unique username
      name: "Jane Doe",
      password: "anotherpassword",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    expect(response.body.error).toContain("Username must be unique.");
  });
});

let initialUser;
let initialBlog;
let authToken;

beforeEach(async () => {
  // Clear the collections and create initial data for testing
  await Blog.deleteMany({});
  await User.deleteMany({});

  initialUser = await User.create({
    username: "testuser",
    name: "Test User",
    passwordHash: "hashedpassword",
  });

  initialBlog = await Blog.create({
    title: "Test Blog",
    author: "Test Author",
    url: "https://test.com",
    likes: 5,
    user: initialUser._id,
  });

  // Generate a valid authentication token
  authToken = jwt.sign({ id: initialUser._id }, process.env.SECRET); // Replace with your actual secret key
});

describe("DELETE /api/blogs/:id", () => {
  test("succeeds in deleting a blog with a valid token and correct user", async () => {
    await api
      .delete(`/api/blogs/${initialBlog._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    const blogsAfterDeletion = await Blog.find({});
    expect(blogsAfterDeletion).toHaveLength(0);
  });

  test("fails to delete a blog without a token", async () => {
    await api
      .delete(`/api/blogs/${initialBlog._id}`)
      .expect(401)
      .expect({ error: "Authentication required." });

    const blogsAfterAttemptedDeletion = await Blog.find({});
    expect(blogsAfterAttemptedDeletion).toHaveLength(1);
  });

  test("fails to delete a blog with an invalid token", async () => {
    await api
      .delete(`/api/blogs/${initialBlog._id}`)
      .set("Authorization", "Bearer invalidtoken")
      .expect(401)
      .expect({ error: "Authentication required." });

    const blogsAfterAttemptedDeletion = await Blog.find({});
    expect(blogsAfterAttemptedDeletion).toHaveLength(1);
  });

  test("fails to delete a blog with a token from a different user", async () => {
    // Create a new user and generate a token for them
    const otherUser = await User.create({
      username: "otheruser",
      name: "Other User",
      passwordHash: "hashedpassword",
    });
    const otherAuthToken = jwt.sign({ id: otherUser._id }, process.env.SECRET);

    await api
      .delete(`/api/blogs/${initialBlog._id}`)
      .set("Authorization", `Bearer ${otherAuthToken}`)
      .expect(403)
      .expect({
        error: "Unauthorized. You do not have permission to delete this blog.",
      });

    const blogsAfterAttemptedDeletion = await Blog.find({});
    expect(blogsAfterAttemptedDeletion).toHaveLength(1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
