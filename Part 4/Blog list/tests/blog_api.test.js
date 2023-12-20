const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blog posts use 'id' as the unique identifier", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("viewing a specific blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(resultBlog.body).toEqual(blogToView);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const contents = response.body.map((r) => r.title);
    expect(contents).toContain("Browser can execute only JavaScript");
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      url: "test",
      author: "true",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain("async/await simplifies making async calls");
  });

  test("blog without title is not added", async () => {
    const newBlog = {
      author: "true",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("if 'likes' property is missing, it defaults to 0", async () => {
    const newBlog = {
      title: "New Blog",
      author: "John Doe",
      url: "https://example.com/new-blog",
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body.likes).toBe(0);
  });

  test("creating a new blog without title returns 400 Bad Request", async () => {
    const newBlogWithoutTitle = {
      author: "John Doe",
      url: "https://example.com/new-blog",
      likes: 5,
    };
    await api.post("/api/blogs").send(newBlogWithoutTitle).expect(400);
  });

  test("creating a new blog without url returns 400 Bad Request", async () => {
    const newBlogWithoutUrl = {
      title: "New Blog",
      author: "John Doe",
      likes: 5,
    };
    await api.post("/api/blogs").send(newBlogWithoutUrl).expect(400);
  });
});

describe("deletion of a blog", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe("updating of a blog", () => {
  test("updating a single blog post", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlogData = {
      title: "Updated Blog Title",
      author: "Updated Author",
      url: "https://example.com/updated-blog",
      likes: 15,
    };
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200);
    expect(response.body).toEqual(expect.objectContaining(updatedBlogData));
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    expect(updatedBlog).toEqual(expect.objectContaining(updatedBlogData));
  });

  test("updating a non-existent blog returns 404 Not Found", async () => {
    const nonExistentId = "5f39e293e9d44a4d6893d999"; // A non-existent ID
    const response = await api
      .put(`/api/blogs/${nonExistentId}`)
      .send({
        title: "Updated Blog Title",
        author: "Updated Author",
        url: "https://example.com/updated-blog",
        likes: 15,
      })
      .expect(404);
    expect(response.body.error).toBe("Blog not found");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
