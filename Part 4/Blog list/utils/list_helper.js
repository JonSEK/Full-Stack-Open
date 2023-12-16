const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikesBlog = blogs.reduce((maxLikesBlog, currentBlog) => {
    return currentBlog.likes > maxLikesBlog.likes ? currentBlog : maxLikesBlog;
  }, blogs[0]);

  const { title, author, likes } = maxLikesBlog;
  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const result = blogs.reduce(
    (result, blog) => {
      const author = blog.author;
      result.counts[author] = (result.counts[author] || 0) + 1;

      if (result.counts[author] > result.maxCount) {
        result.maxCount = result.counts[author];
        result.mostAppearedAuthor = author;
      }

      return result;
    },
    { counts: {}, mostAppearedAuthor: "", maxCount: 0 }
  );

  return {
    author: result.mostAppearedAuthor,
    blogs: result.maxCount,
  };
};

const mostLikes = (blogs) => {
  const result = blogs.reduce(
    (result, blog) => {
      const author = blog.author;
      result.likes[author] = (result.likes[author] || 0) + blog.likes;

      if (result.likes[author] > result.maxLikes) {
        result.maxLikes = result.likes[author];
        result.mostLikedAuthor = author;
      }

      return result;
    },
    { likes: {}, mostLikedAuthor: "", maxLikes: 0 }
  );

  return {
    author: result.mostLikedAuthor,
    likes: result.maxLikes,
  };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
