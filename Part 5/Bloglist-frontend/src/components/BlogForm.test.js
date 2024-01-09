import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("calls the createBlog prop with the right details when a new blog is created", async () => {
  const createBlog = jest.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const createButton = screen.getByRole("button", { name: /create/i });

  await userEvent.type(titleInput, "Test Title");
  await userEvent.type(authorInput, "Test Author");
  await userEvent.type(urlInput, "http://test.com");
  userEvent.click(createButton);

  await waitFor(() =>
    expect(createBlog).toHaveBeenCalledWith({
      title: "Test Title",
      author: "Test Author",
      url: "http://test.com",
    })
  );
});
