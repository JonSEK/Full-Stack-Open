const BlogForm = ({
  addBlog,
  newTitle,
  newAuthor,
  newURL,
  handleTitleChange,
  handleAuthorChange,
  handleURLChange,
}) => {
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          url: <input value={newURL} onChange={handleURLChange} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </>
  );
};

export default BlogForm;
