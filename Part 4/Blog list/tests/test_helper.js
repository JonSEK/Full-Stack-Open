const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "test1",
    url: "xfxdf",
    likes: 5,
  },
  {
    title: "Browser can execute only JavaScript",
    author: "test2",
    url: "xfxdf",
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
