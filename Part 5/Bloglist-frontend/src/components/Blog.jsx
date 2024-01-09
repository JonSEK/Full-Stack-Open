import Togglable from "./Togglable";

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(updatedBlog);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}
      </div>
      <Togglable buttonLabel="view">
        <div>{blog.url}</div>
        <div className="likes-count">
          likes {blog.likes}
          <button id="like-button" onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.name === user.name && (
          <button id="delete-button" onClick={handleDelete}>delete</button>
        )}
      </Togglable>
    </div>
  );
};

export default Blog;
