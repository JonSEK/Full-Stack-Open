describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "123123",
      username: "123",
      password: "123",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it("login form can be opened", function () {
    cy.contains("log in").click();
  });

  describe("Login", function () {
    it("user can login", function () {
      cy.contains("log in").click();
      cy.get("#username").type("123");
      cy.get("#password").type("123");
      cy.get("#login-button").click();

      cy.contains("123123 logged in");
    });

    it("login fails with wrong password", function () {
      cy.contains("log in").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
      cy.get("html").should("not.contain", "Matti Luukkainen logged in");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "123", password: "123" });
    });

    it("a new blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("a blog created by cypress");
      cy.get("#author").type("a blog created by cypress");
      cy.get("#url").type("a blog created by cypress");
      cy.get("#create-button").click();
      cy.contains("a blog created by cypress");
    });

    it("users can like a blog", function () {
      cy.createBlog({
        title: "a blog created by cypress",
        author: "a blog created by cypress",
        url: "a blog created by cypress",
        likes: 0,
      });

      cy.contains("a blog created by cypress").parent().as("blog");
      cy.get("@blog").find("#toggle-button").click();
      cy.get("@blog").find("#like-button").click();
      cy.get("@blog").find(".likes-count").should("contain", "1");
    });

    it("user who created a blog can delete it", function () {
      cy.createBlog({
        title: "a blog created by cypress",
        author: "a blog created by cypress",
        url: "a blog created by cypress",
      });

      cy.contains("a blog created by cypress").parent().as("blog");
      cy.get("@blog").find("#toggle-button").click();
      cy.get("@blog").find("#delete-button").click();

      cy.get("html").should("not.contain", "a blog created by cypress");
    });

    it("only the creator can see the delete button of a blog", function () {
      cy.createUser({ username: "456", password: "456" });
      cy.createBlog({
        title: "a blog created by cypress",
        author: "a blog created by cypress",
        url: "a blog created by cypress",
      });
      cy.contains("a blog created by cypress").parent().as("blog");
      cy.get("@blog").find("#toggle-button").click();
      cy.get("@blog").find("#delete-button").should("be.visible");
      cy.logout();
      cy.login({ username: "123", password: "123" });
      cy.get("@blog").find("#delete-button").should("not.be.visible");
    });

    it("blogs are ordered according to likes with the blog with the most likes being first", function () {
      cy.createBlog({
        title: "first blog",
        author: "cypress",
        url: "cypress",
      });

      cy.createBlog({
        title: "second blog",
        author: "cypress",
        url: "cypress",
      });

      cy.createBlog({
        title: "third blog",
        author: "cypress",
        url: "cypress",
      });

      cy.contains("first blog").parent().find("#toggle-button").click();
      cy.contains("first blog")
        .parent()
        .find("#like-button")
        .as("firstBlogLikeButton");

      cy.contains("second blog").parent().find("#toggle-button").click();
      cy.contains("second blog")
        .parent()
        .find("#like-button")
        .as("secondBlogLikeButton");

      cy.contains("third blog").parent().find("#toggle-button").click();
      cy.contains("third blog")
        .parent()
        .find("#like-button")
        .as("thirdBlogLikeButton");

      // Like the first blog 5 times
      for (let i = 0; i < 5; i++) {
        cy.get("@firstBlogLikeButton").click();
      }

      // Like the second blog 10 times
      for (let i = 0; i < 10; i++) {
        cy.get("@secondBlogLikeButton").click();
      }

      // Like the third blog 7 times
      for (let i = 0; i < 7; i++) {
        cy.get("@thirdBlogLikeButton").click();
      }

      cy.get(".blog").then((blogs) => {
        cy.wrap(blogs[0]).should("contain", "second blog");
        cy.get(".likes-count").should("contain", "10");
        cy.wrap(blogs[1]).should("contain", "third blog");
        cy.get(".likes-count").should("contain", "7");
        cy.wrap(blogs[2]).should("contain", "first blog");
        cy.get(".likes-count").should("contain", "5");
      });
    });
  });
});
