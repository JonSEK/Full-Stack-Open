import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders title and author, but not URL or likes by default", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "http://test.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  const mockHandler = jest.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      deleteBlog={mockHandler}
      user={blog.user}
    />
  );

  // Check that the title and author are rendered
  expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeInTheDocument();

  // Check that the URL and likes are not rendered
  const detailsElement = screen.getByTestId("blog-details");
  expect(detailsElement).toHaveStyle("display: none");
});

test("shows URL and likes when the 'view' button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "http://test.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  const mockHandler = jest.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      deleteBlog={mockHandler}
      user={blog.user}
    />
  );

  // Click the 'view' button
  const viewButton = screen.getByText("view");
  userEvent.click(viewButton);

  // Check that the URL and likes are rendered
  const urlElement = screen.getByText(blog.url);
  expect(urlElement).toBeInTheDocument();

  const likesElement = screen.getByText(`likes ${blog.likes}`);
  expect(likesElement).toBeInTheDocument();
});

test("calls the updateBlog prop twice when the 'like' button is clicked twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Author",
    url: "http://test.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  const mockHandler = jest.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      deleteBlog={jest.fn()}
      user={blog.user}
    />
  );

  // Click the 'view' button to show the 'like' button
  const viewButton = screen.getByText("view");
  userEvent.click(viewButton);

  // Click the 'like' button twice
  const likeButton = await screen.findByText("like");
  userEvent.click(likeButton);
  userEvent.click(likeButton);

  // Check that the updateBlog prop was called twice
  await waitFor(() => expect(mockHandler).toHaveBeenCalledTimes(2));
});